'use client'

import { useEffect, useState } from 'react'
import { HistoryPagination } from './history-pagination'
import { HistorySkeleton } from './history-skeleton'

export function PurchasesHistory({ initialQuery = {} }) {
  const [data, setData] = useState({ items: [], total: 0, page: Number(initialQuery.page || 1), limit: 10 })
  const [loading, setLoading] = useState(true)
  const [offline, setOffline] = useState(false)
  const query = new URLSearchParams(initialQuery).toString()
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setOffline(!navigator.onLine)
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch(`/api/purchases?${query}`)
          const payload = await response.json()
          if (!cancelled) setData(payload?.items ? payload : { items: [], total: 0, page: Number(initialQuery.page || 1), limit: 10 })
          break
        } catch {
          if (attempt === 2 && !cancelled) setData({ items: [], total: 0, page: 1, limit: 10 })
          await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)))
        }
      }
      if (!cancelled) setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [query, initialQuery.page])
  return <div className="flex flex-col gap-5">{offline && <div role="status" className="rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-muted-foreground">Sin conexión. Mostrando el último estado disponible; volveremos a intentar cuando regreses online.</div>}<div className="flex flex-wrap gap-3"><select aria-label="Estado" defaultValue={initialQuery.status || ''} onChange={(e) => { const p = new URLSearchParams(window.location.search); e.target.value ? p.set('status', e.target.value) : p.delete('status'); p.set('page', '1'); window.location.href = `/compras?${p}` }} className="rounded-md border border-border bg-card px-3 py-2 text-sm"><option value="">Todos los estados</option><option value="completed">Completadas</option><option value="pending">Pendientes</option><option value="failed">Fallidas</option></select></div>{loading ? <HistorySkeleton /> : data.items.length === 0 ? <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">Todavía no tienes compras.</div> : <div className="overflow-x-auto rounded-lg border border-border transition-shadow duration-200 hover:dark-tech-glow"><table className="w-full text-left text-sm"><thead className="bg-card text-muted-foreground"><tr><th className="p-4">Paquete</th><th className="p-4">Créditos</th><th className="p-4">Importe</th><th className="p-4">Estado</th><th className="p-4">Fecha</th></tr></thead><tbody>{data.items.map((item) => <tr className="border-t border-border" key={item.id}><td className="p-4">{item.package_name || 'Paquete'}</td><td className="p-4">{item.credits_purchased}</td><td className="p-4">{item.amount_usd} $</td><td className="p-4 capitalize">{item.status}</td><td className="p-4 text-muted-foreground">{new Date(item.created_at).toLocaleDateString('es-ES')}</td></tr>)}</tbody></table></div>}<HistoryPagination page={data.page} total={data.total} limit={data.limit} basePath="/compras" query={initialQuery} /></div>
}
