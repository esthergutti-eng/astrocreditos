import { StudyForm } from '@/components/study-form'

export default function CartaNatalPage() {
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><div className="mb-10 max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Nuevo estudio</p><h1 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">Carta astral</h1><p className="mt-4 text-pretty leading-6 text-muted-foreground">Descubre el mapa natal de una persona a través de sus coordenadas de nacimiento.</p></div><StudyForm studyType="carta_natal" title="Carta astral" description="Necesitamos tus datos de nacimiento para preparar una lectura personalizada." fields={['birthDate', 'birthTime', 'birthPlace']} /></main>
}
