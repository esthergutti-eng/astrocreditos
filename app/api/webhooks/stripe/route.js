import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export const runtime = 'nodejs'

function getStripeClient() {
  const apiKey = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY
  if (!apiKey) throw new Error('Stripe no está configurado en el servidor.')
  return new Stripe(apiKey)
}

export async function POST(request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return NextResponse.json({ error: 'Webhook no configurado.' }, { status: 400 })

  let event
  try {
    const stripe = getStripeClient()
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret)
  } catch (error) {
    return NextResponse.json({ error: `Firma inválida: ${error.message}` }, { status: 400 })
  }
  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) return NextResponse.json({ received: true })

  const checkoutSession = event.data.object
  if (checkoutSession.payment_status !== 'paid' && event.type === 'checkout.session.completed') return NextResponse.json({ received: true })
  const purchaseId = checkoutSession.client_reference_id || checkoutSession.metadata?.purchase_id
  if (!purchaseId) return NextResponse.json({ received: true })

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const purchase = await client.query('SELECT id, user_id, credits_purchased, status FROM public.purchases WHERE id = $1 FOR UPDATE', [purchaseId])
    const row = purchase.rows[0]
    if (!row) { await client.query('ROLLBACK'); return NextResponse.json({ received: true }) }
    if (row.status === 'completed') { await client.query('COMMIT'); return NextResponse.json({ received: true, duplicate: true }) }
    await client.query("UPDATE public.purchases SET status = 'completed', stripe_session_id = $1 WHERE id = $2", [checkoutSession.id, purchaseId])
    await client.query("INSERT INTO public.credit_transactions (user_id, type, amount, reference_id, description) SELECT $1, 'purchase', $2, $3, 'Compra de créditos confirmada por Stripe' WHERE NOT EXISTS (SELECT 1 FROM public.credit_transactions WHERE reference_id = $3 AND type = 'purchase')", [row.user_id, row.credits_purchased, purchaseId])
    await client.query('UPDATE public.profiles SET credits_balance = credits_balance + $1 WHERE id = $2', [row.credits_purchased, row.user_id])
    await client.query('COMMIT')
    return NextResponse.json({ received: true })
  } catch (error) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'No se pudo procesar el pago.' }, { status: 500 }) } finally { client.release() }
}
