'use client'

import { useEffect, useState } from 'react'
import { HistoryPagination } from './history-pagination'

export function StudiesHistory({ initialQuery = {} }) {
  const [data, setData] = useState({ items: [], total: 0, page: Number(initialQuery.page || 1), limit: 10 })
  const [open, setOpen] = useState(null)
  const query = new URLSearchParams(initialQuery).toString()
  useEffect(() => { fetch(`/api/studies?${query}`).then((r) => r.json()).then((payload) => setData(payload?.items ? payload : { items: [], total: 0, page: Number(initialQuery.page || 1), limit: 10 })).catch(() => setData({ items: [], total: 0, page: 1, limit: 10 })) }, [query, initialQuery.page])
  return <div className="flex flex-col gap-5"><select aria-label="Tipo de estudio" defaultValue={initialQuery.type || ''} onChange={(e) => { const p = new URLSearchParams(window.location.search); e.target.value ? p.set('type', e.target.value) : p.delete('type'); p.set('page', '1'); window.location.href = `/estudios?${p}` }} className="w-fit rounded-md border border-border bg-card px-3 py-2 text-sm"><option value="">Todos los tipos</option><option value="carta_natal">Carta astral</option><option value="sinastria">Sinastría</option><option value="revolucion_solar">Revolución solar</option></select>{data.items.length === 0 ? <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">Todavía no tienes estudios.</div> : <div className="flex flex-col gap-3">{data.items.map((item) => <article className="rounded-lg border border-border bg-card p-5" key={item.id}><button className="flex w-full items-center justify-between text-left" onClick={() => setOpen(open === item.id ? null : item.id)}><span><span className="block font-heading font-semibold">{item.title}</span><span className="text-sm text-muted-foreground">{item.type_name} · {new Date(item.created_at).toLocaleDateString('es-ES')}</span></span><span className="text-primary">{open === item.id ? '−' : '+'}</span></button>{open === item.id && <pre className="mt-4 overflow-auto rounded-md bg-background p-4 text-xs text-muted-foreground">{JSON.stringify(item.result_data || item.input_data, null, 2)}</pre>}</article>)}</div>}<HistoryPagination page={data.page} total={data.total} limit={data.limit} basePath="/estudios" query={initialQuery} /></div>
}
