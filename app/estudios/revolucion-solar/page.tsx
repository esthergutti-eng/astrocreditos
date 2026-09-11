import { StudyForm } from '@/components/study-form'

export default function RevolucionSolarPage() {
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><div className="mb-10 max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Nuevo estudio</p><h1 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">Revolución solar</h1><p className="mt-4 text-pretty leading-6 text-muted-foreground">Descubre la energía de tu nuevo ciclo solar.</p></div><StudyForm studyType="revolucion_solar" title="Revolución solar" description="Usaremos tus datos de nacimiento y tu ubicación actual para preparar el estudio." fields={['birthDate', 'birthTime', 'currentPlace']} /></main>
}
