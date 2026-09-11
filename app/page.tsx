import Link from 'next/link'
import { ArrowUpRight, CircleStar, Sparkles, Sun, UsersRound, Zap } from 'lucide-react'

const studies = [
  { icon: CircleStar, name: 'Carta astral', description: 'Conoce el mapa natal de una persona' },
  { icon: UsersRound, name: 'Sinastría', description: 'Explora la conexión entre dos personas' },
  { icon: Sun, name: 'Revolución solar', description: 'Descubre la energía de un nuevo ciclo solar' },
]

const packages = [
  { name: 'Iniciación', credits: 10, price: 10, featured: false },
  { name: 'Estándar', credits: 20, price: 20, featured: true },
  { name: 'Premium', credits: 50, price: 50, featured: false },
]

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <header className="flex items-center justify-between border-b border-border py-6">
          <a href="#top" className="flex items-center gap-3 font-heading text-sm font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            Astro<span className="text-primary">Créditos</span>
          </a>
          <span className="hidden font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground sm:block">Cosmos / claridad / conexión</span>
        </header>

        <section id="top" className="relative flex min-h-[500px] flex-col justify-center py-20 lg:min-h-[600px] lg:py-28">
          <div className="pointer-events-none absolute right-0 top-20 hidden size-72 rounded-full border border-primary/20 lg:block" aria-hidden="true">
            <div className="absolute inset-8 rounded-full border border-secondary/30" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-primary/10" />
            <div className="absolute left-0 top-1/2 h-px w-full bg-primary/10" />
          </div>
          <div className="relative max-w-3xl">
            <p className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-primary"><Zap className="size-4" aria-hidden="true" /> lectura cósmica, sin ruido</p>
            <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-[1.05] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">Descubre lo que el <span className="text-primary">cosmos</span> tiene para ti</h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">Genera tu carta astral, tu sinastría o tu revolución solar en minutos.</p>
            <button type="button" className="mt-10 inline-flex items-center gap-3 rounded-md bg-primary px-6 py-3.5 font-heading text-sm font-bold text-primary-foreground shadow-glow transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">Crear cuenta gratis <ArrowUpRight className="size-4" aria-hidden="true" /></button>
          </div>
          <div className="absolute bottom-10 right-0 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:block">01 / 03 — tu mapa empieza aquí</div>
        </section>

        <section className="border-t border-border py-20 lg:py-24" aria-labelledby="studies-title">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-secondary">Explora</p><h2 id="studies-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">¿Qué quieres crear hoy?</h2></div><p className="max-w-xs text-sm leading-relaxed text-muted-foreground">Una nueva perspectiva para cada pregunta que traes contigo.</p></div>
          <div className="grid gap-4 md:grid-cols-3">{studies.map(({ icon: Icon, name, description }) => <Link key={name} href={`/estudios/${name === 'Carta astral' ? 'carta-natal' : name === 'Sinastría' ? 'sinastria' : 'revolucion-solar'}`} className="group rounded-lg border border-border bg-card p-6 shadow-card transition-transform duration-200 ease-out hover:scale-[1.02]"><div className="mb-12 flex size-11 items-center justify-center rounded-md border border-primary/30 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="size-5" aria-hidden="true" /></div><h3 className="font-heading text-xl font-semibold">{name}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></Link>)}</div>
        </section>

        <section className="border-t border-border py-20 lg:py-24" aria-labelledby="packages-title">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Tu energía, a tu ritmo</p><h2 id="packages-title" className="mt-2 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Paquetes de créditos</h2></div><p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">sin suscripción / sin caducidad</p></div>
          <div className="grid gap-4 md:grid-cols-3">{packages.map((pack) => <article key={pack.name} className={`relative rounded-lg border p-6 shadow-card transition-transform duration-200 ease-out hover:scale-[1.02] ${pack.featured ? 'border-primary bg-card' : 'border-border bg-card'}`}>{pack.featured && <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">recomendado</span>}<p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">{pack.name}</p><p className="mt-8 font-heading text-4xl font-semibold tracking-tight">{pack.credits}<span className="ml-2 text-base font-normal text-muted-foreground">créditos</span></p><div className="mt-8 flex items-end justify-between border-t border-border pt-5"><span className="font-heading text-2xl font-semibold">{pack.price} <span className="text-sm font-normal text-muted-foreground">$</span></span><span className="font-mono text-xs text-muted-foreground">pago único</span></div></article>)}</div>
          <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.16em] text-secondary">Cada estudio cuesta 5 créditos</p>
        </section>

        <footer className="flex flex-col gap-3 border-t border-border py-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span className="font-heading font-semibold text-foreground">AstroCréditos</span><span>AstroCréditos © 2024 · España</span></footer>
      </div>
    </main>
  )
}

// TODO: RLS se implementará en la Fase 7; esta landing es pública y estática.
