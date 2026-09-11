import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'
import { withUserContext } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const result = await withUserContext(session.user.id, (client) => client.query(
    `SELECT id, user_id, full_name, email, birth_date, birth_time, birth_place, credits_balance, created_at
     FROM public.profiles WHERE user_id = $1 LIMIT 1`,
    [session.user.id],
  ))
  if (!result.rows[0]) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
  return NextResponse.json({ profile: result.rows[0] })
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
