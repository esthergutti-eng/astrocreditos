import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'
import { withUserContext } from '@/lib/db'

export async function GET(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number.parseInt(searchParams.get('page') || '1', 10) || 1)
  const limit = 10
  const status = searchParams.get('status')
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  const profile = await pool.query('SELECT id FROM public.profiles WHERE user_id = $1 LIMIT 1', [session.user.id])
  if (!profile.rows[0]) return NextResponse.json({ error: 'Perfil no encontrado.' }, { status: 404 })
  const values = [profile.rows[0].id]
  const filters = ['p.user_id = $1']
  if (['pending', 'completed', 'failed'].includes(status)) { values.push(status); filters.push(`p.status = $${values.length}`) }
  if (from && /^\\d{4}-\\d{2}-\\d{2}$/.test(from)) { values.push(from); filters.push(`p.created_at >= $${values.length}::date`) }
  if (to && /^\\d{4}-\\d{2}-\\d{2}$/.test(to)) { values.push(to); filters.push(`p.created_at < ($${values.length}::date + interval '1 day')`) }
  const offset = (page - 1) * limit
  values.push(limit, offset)
  const result = await pool.query(`SELECT p.id, p.amount_usd, p.credits_purchased, p.status, p.created_at, c.name AS package_name, COUNT(*) OVER()::int AS total_count FROM public.purchases p LEFT JOIN public.credit_packages c ON c.id = p.package_id WHERE ${filters.join(' AND ')} ORDER BY p.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values)
  return NextResponse.json({ items: result.rows, total: result.rows[0]?.total_count || 0, page, limit })
}

export const dynamic = 'force-dynamic'
