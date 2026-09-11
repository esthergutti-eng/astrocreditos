import { PurchasesHistory } from '@/components/purchases-history'

export default async function ComprasPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams
  const initialQuery = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || '']))
  return <div className="flex flex-col gap-8"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Actividad financiera</p><h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">Mis compras</h1><p className="mt-3 text-muted-foreground">Consulta tus paquetes de créditos y su estado.</p></div><PurchasesHistory initialQuery={initialQuery} /></div>
}
