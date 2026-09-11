import { StudiesHistory } from '@/components/studies-history'

export default async function EstudiosPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const raw = await searchParams
  const initialQuery = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value || '']))
  return <div className="flex flex-col gap-8"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Archivo astral</p><h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight">Mis estudios</h1><p className="mt-3 text-muted-foreground">Revisa tus estudios generados y abre sus detalles.</p></div><StudiesHistory initialQuery={initialQuery} /></div>
}
