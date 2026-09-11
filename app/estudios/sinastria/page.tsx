import { StudyForm } from '@/components/study-form'

export default function SinastriaPage() {
  return <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8"><div className="mb-10 max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Nuevo estudio</p><h1 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">Sinastría</h1><p className="mt-4 text-pretty leading-6 text-muted-foreground">Explora la conexión entre dos personas a partir de sus datos astrales.</p></div><StudyForm studyType="sinastria" title="Sinastría" description="Introduce los datos de ambas personas para comparar sus mapas." fields={['personOneName', 'personOneDate', 'personOneTime', 'personOnePlace', 'personTwoName', 'personTwoDate', 'personTwoTime', 'personTwoPlace']} /></main>
}
