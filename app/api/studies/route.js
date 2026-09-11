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
  const type = searchParams.get('type')
  const profile = await pool.query('SELECT id FROM public.profiles WHERE user_id = $1 LIMIT 1', [session.user.id])
  if (!profile.rows[0]) return NextResponse.json({ error: 'Perfil no encontrado.' }, { status: 404 })
  const values = [profile.rows[0].id]
  const filters = ['s.user_id = $1']
  if (['carta_natal', 'sinastria', 'revolucion_solar'].includes(type)) { values.push(type); filters.push(`t.code = $${values.length}`) }
  const offset = (page - 1) * limit
  values.push(limit, offset)
  const result = await pool.query(`SELECT s.id, s.title, s.status, s.input_data, s.result_data, s.credits_spent, s.created_at, t.code AS type_code, t.name AS type_name, COUNT(*) OVER()::int AS total_count FROM public.studies s LEFT JOIN public.study_types t ON t.id = s.study_type_id WHERE ${filters.join(' AND ')} ORDER BY s.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`, values)
  return NextResponse.json({ items: result.rows, total: result.rows[0]?.total_count || 0, page, limit })
}

export const dynamic = 'force-dynamic'
