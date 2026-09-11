import { ArrowLeft, ArrowUpRight, Check, CreditCard, Sparkles } from 'lucide-react'
import Link from 'next/link'
import PurchaseButton from '@/components/purchase-button'
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'

// TODO: RLS se implementará en la Fase 7; esta lectura ocurre desde backend.

type PackageRow = {
  id: string
  name: string
  credits: number
  price_usd: string
  stripe_payment_link: string | null
  sort_order: number
}

async function getPackages(): Promise<PackageRow[]> {
  const result = await pool.query(
    'SELECT id, name, credits, price_usd, stripe_payment_link, sort_order FROM public.credit_packages WHERE active = true ORDER BY sort_order ASC',
  )
  return result.rows
}

export default async function PurchasePage() {
  const packages = await getPackages()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <Link href="/" className="flex items-center gap-3 font-heading text-sm font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow"><Sparkles className="size-4" aria-hidden="true" /></span>
            Astro<span className="text-primary">Créditos</span>
          </Link>
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Dashboard</Link>
        </header>

        <section className="mx-auto max-w-3xl py-16 text-center lg:py-24">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">Compra una vez, crea cuando quieras</p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-balance sm:text-6xl">Elige tu próxima lectura</h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">Créditos flexibles para explorar tu carta astral, tu sinastría o tu revolución solar.</p>
        </section>

        <section aria-labelledby="packages-title" className="pb-20">
          <h2 id="packages-title" className="sr-only">Paquetes de créditos disponibles</h2>
          {packages.length === 0 ? <p className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">No hay paquetes disponibles ahora mismo.</p> : <div className="grid gap-4 md:grid-cols-3">{packages.map((pack, index) => <article key={pack.id} className={`relative flex flex-col rounded-lg border bg-card p-6 shadow-card transition-transform duration-200 ease-out hover:scale-[1.02] ${index === 1 ? 'border-primary' : 'border-border'}`}>{index === 1 && <span className="absolute right-5 top-5 rounded-full bg-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary-foreground">recomendado</span>}<div className="flex size-11 items-center justify-center rounded-md border border-primary/30 text-primary"><CreditCard className="size-5" aria-hidden="true" /></div><h3 className="mt-8 font-heading text-xl font-semibold">{pack.name}</h3><p className="mt-5 font-heading text-5xl font-semibold tracking-tight">{pack.credits}<span className="ml-2 text-base font-normal text-muted-foreground">créditos</span></p><p className="mt-3 text-sm text-muted-foreground">{pack.credits / 5} {pack.credits / 5 === 1 ? 'estudio' : 'estudios'} incluidos</p><div className="mt-8 flex items-end justify-between border-t border-border pt-5"><span className="font-heading text-3xl font-semibold">{Number(pack.price_usd).toFixed(2)} <span className="text-sm font-normal text-muted-foreground">$</span></span><span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">pago único</span></div><div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground"><Check className="size-4 text-primary" aria-hidden="true" /> Sin suscripción ni caducidad</div><PurchaseButton packageId={pack.id} paymentLink={pack.stripe_payment_link} /></article>)}</div>}
          <p className="mt-8 text-center font-mono text-xs uppercase tracking-[0.16em] text-secondary">Cada estudio cuesta 5 créditos</p>
        </section>

        <footer className="flex items-center justify-between border-t border-border py-8 text-xs text-muted-foreground"><span className="font-heading font-semibold text-foreground">AstroCréditos</span><span>Pago seguro procesado por Stripe</span><ArrowUpRight className="size-4" aria-hidden="true" /></footer>
      </div>
    </main>
  )
}
