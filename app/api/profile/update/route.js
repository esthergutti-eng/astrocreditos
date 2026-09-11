import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth-options'
import pool from '@/lib/db'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/

function cleanText(value, maxLength) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') throw new Error('Formato inválido')
  const cleaned = value.trim()
  return cleaned ? cleaned.slice(0, maxLength) : null
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  let body
  try { body = await request.json() } catch { return NextResponse.json({ error: 'JSON inválido' }, { status: 400 }) }

  try {
    const fullName = cleanText(body.full_name, 120)
    const birthPlace = cleanText(body.birth_place, 160)
    const birthDate = body.birth_date || null
    const birthTime = body.birth_time || null
    if (fullName === '') return NextResponse.json({ error: 'El nombre no puede estar vacío' }, { status: 400 })
    if (birthDate && (!DATE_PATTERN.test(birthDate) || Number.isNaN(Date.parse(birthDate)))) return NextResponse.json({ error: 'Fecha de nacimiento inválida' }, { status: 400 })
    if (birthTime && !TIME_PATTERN.test(birthTime)) return NextResponse.json({ error: 'Hora de nacimiento inválida' }, { status: 400 })

    const result = await pool.query(
      `UPDATE public.profiles
       SET full_name = $1, birth_date = $2, birth_time = $3, birth_place = $4
       WHERE user_id = $5
       RETURNING id, user_id, full_name, email, birth_date, birth_time, birth_place, credits_balance, created_at`,
      [fullName, birthDate, birthTime, birthPlace, session.user.id],
    )
    if (!result.rows[0]) return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 })
    return NextResponse.json({ profile: result.rows[0] })
  } catch (error) {
    if (error instanceof Error && error.message === 'Formato inválido') return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ error: 'No se pudo actualizar el perfil' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
