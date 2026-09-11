'use client'

import Link from 'next/link'

export function HistoryPagination({ page, total, limit, basePath, query }) {
  const pages = Math.max(1, Math.ceil(total / limit))
  if (pages <= 1) return null
  const makeHref = (next) => `${basePath}?${new URLSearchParams({ ...query, page: String(next) }).toString()}`
  return <nav aria-label="Paginación" className="flex items-center justify-between border-t border-border pt-4 text-sm"><span className="text-muted-foreground">Página {page} de {pages}</span><div className="flex gap-2"><Link aria-disabled={page <= 1} className="rounded-md border border-border px-3 py-2 hover:border-primary aria-disabled:pointer-events-none aria-disabled:opacity-40" href={makeHref(Math.max(1, page - 1))}>Anterior</Link><Link aria-disabled={page >= pages} className="rounded-md border border-border px-3 py-2 hover:border-primary aria-disabled:pointer-events-none aria-disabled:opacity-40" href={makeHref(Math.min(pages, page + 1))}>Siguiente</Link></div></nav>
}
