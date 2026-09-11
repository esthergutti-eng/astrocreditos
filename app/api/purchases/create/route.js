import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'
import pool from '@/lib/db'

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Debes iniciar sesión para comprar créditos.' }, { status: 401 })

  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 }) }
  const packageId = typeof body?.packageId === 'string' ? body.packageId : ''
  if (!packageId) return NextResponse.json({ error: 'Paquete inválido.' }, { status: 400 })

  const packageResult = await pool.query('SELECT id, credits, price_usd, stripe_payment_link FROM public.credit_packages WHERE id = $1 AND active = true LIMIT 1', [packageId])
  const pack = packageResult.rows[0]
  if (!pack?.stripe_payment_link) return NextResponse.json({ error: 'Paquete no disponible.' }, { status: 404 })

  const profileResult = await pool.query('SELECT id FROM public.profiles WHERE user_id = $1 LIMIT 1', [session.user.id])
  const profile = profileResult.rows[0]
  if (!profile) return NextResponse.json({ error: 'No existe un perfil asociado a tu cuenta.' }, { status: 409 })

  const pending = await pool.query("SELECT id FROM public.purchases WHERE user_id = $1 AND package_id = $2 AND status = 'pending' AND created_at > now() - interval '30 minutes' ORDER BY created_at DESC LIMIT 1", [profile.id, pack.id])
  const purchaseId = pending.rows[0]?.id || (await pool.query('INSERT INTO public.purchases (user_id, package_id, amount_usd, credits_purchased, status) VALUES ($1, $2, $3, $4, \'pending\') RETURNING id', [profile.id, pack.id, pack.price_usd, pack.credits])).rows[0].id
  const paymentUrl = new URL(pack.stripe_payment_link)
  paymentUrl.searchParams.set('client_reference_id', purchaseId)
  paymentUrl.searchParams.set('purchase_id', purchaseId)
  return NextResponse.json({ paymentLink: paymentUrl.toString(), purchaseId })
}
