'use client'

import { ArrowUpRight, LoaderCircle } from 'lucide-react'
import { useState } from 'react'

export default function PurchaseButton({ packageId, paymentLink }: { packageId: string; paymentLink: string | null }) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function handlePurchase() {
    if (!paymentLink) return
    setError('')
    setIsLoading(true)
    try {
      const response = await fetch('/api/purchases/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ packageId }) })
      const data = await response.json()
      if (response.status === 401) { window.location.href = `/auth/signin?callbackUrl=${encodeURIComponent('/comprar')}`; return }
      if (!response.ok) throw new Error(data.error || 'No se pudo iniciar la compra')
      window.location.href = data.paymentLink
    } catch (purchaseError) {
      setError(purchaseError instanceof Error ? purchaseError.message : 'No se pudo iniciar la compra')
      setIsLoading(false)
    }
  }

  return <div className="mt-8"><button type="button" onClick={handlePurchase} disabled={isLoading || !paymentLink} className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 font-heading text-sm font-bold text-primary-foreground shadow-glow transition-transform duration-200 ease-out hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <ArrowUpRight className="size-4" aria-hidden="true" />} {isLoading ? 'Preparando…' : 'Comprar créditos'}</button>{error && <p role="alert" className="mt-2 text-xs text-destructive">{error}</p>}</div>
}
