'use client'

import { useEffect, useState } from 'react'
import { HistoryPagination } from './history-pagination'
import { HistorySkeleton } from './history-skeleton'

export function StudiesHistory({ initialQuery = {} }) {
  const [data, setData] = useState({ items: [], total: 0, page: Number(initialQuery.page || 1), limit: 10 })
  const [open, setOpen] = useState(null)
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
          const response = await fetch(`/api/studies?${query}`)
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
  return <div className="flex flex-col gap-5">{offline && <div role="status" className="rounded-md border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-muted-foreground">Sin conexión. Puedes seguir consultando el historial guardado cuando vuelva la red.</div>}<select aria-label="Tipo de estudio" defaultValue={initialQuery.type || ''} onChange={(e) => { const p = new URLSearchParams(window.location.search); e.target.value ? p.set('type', e.target.value) : p.delete('type'); p.set('page', '1'); window.location.href = `/estudios?${p}` }} className="w-fit rounded-md border border-border bg-card px-3 py-2 text-sm"><option value="">Todos los tipos</option><option value="carta_natal">Carta astral</option><option value="sinastria">Sinastría</option><option value="revolucion_solar">Revolución solar</option></select>{loading ? <HistorySkeleton /> : data.items.length === 0 ? <div className="rounded-lg border border-dashed border-border bg-card p-8 text-center transition-colors duration-200 hover:border-primary/40"><p className="font-heading text-lg font-semibold text-foreground">Tu historia astral empieza aquí</p><p className="mt-2 text-sm text-muted-foreground">Crea tu primer estudio para verlo aparecer en este espacio.</p></div> : <div className="flex flex-col gap-3">{data.items.map((item) => <article className="rounded-lg border border-border bg-card p-5 transition-all duration-200 hover:-translate-y-0.5 hover:dark-tech-glow" key={item.id}><button className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === item.id ? null : item.id)}><span><span className="block font-heading font-semibold">{item.title}</span><span className="text-sm text-muted-foreground">{item.type_name} · {new Date(item.created_at).toLocaleDateString('es-ES')}</span></span><span className="text-primary">{open === item.id ? '−' : '+'}</span></button>{open === item.id && <pre className="mt-4 overflow-auto rounded-md bg-background p-4 text-xs text-muted-foreground">{JSON.stringify(item.result_data || item.input_data, null, 2)}</pre>}</article>)}</div>}<HistoryPagination page={data.page} total={data.total} limit={data.limit} basePath="/estudios" query={initialQuery} /></div>
}
