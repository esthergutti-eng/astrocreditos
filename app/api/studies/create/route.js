import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import pool from '@/lib/db'

const STUDY_CONFIG = {
  carta_natal: { title: 'Carta astral', label: 'carta natal' },
  sinastria: { title: 'Sinastría', label: 'sinastría' },
  revolucion_solar: { title: 'Revolución solar', label: 'revolución solar' },
}

function simulatedResult(code, inputData) {
  return {
    generatedAt: new Date().toISOString(),
    note: 'Resultado simulado. El cálculo astrológico real se integrará en una fase posterior.',
    studyType: code,
    inputSummary: inputData,
    planetaryPositions: [
      { planet: 'Sol', sign: 'Aries', degree: 14.2, house: 1 },
      { planet: 'Luna', sign: 'Cáncer', degree: 27.8, house: 4 },
      { planet: 'Mercurio', sign: 'Piscis', degree: 8.5, house: 12 },
      { planet: 'Venus', sign: 'Tauro', degree: 3.1, house: 2 },
      { planet: 'Marte', sign: 'Géminis', degree: 19.6, house: 3 },
    ],
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return Response.json({ error: 'Necesitas iniciar sesión.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const code = body?.studyType
  const inputData = body?.inputData
  const config = STUDY_CONFIG[code]
  if (!config || !inputData || typeof inputData !== 'object') {
    return Response.json({ error: 'Los datos del estudio no son válidos.' }, { status: 400 })
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const profileResult = await client.query('SELECT id, credits_balance FROM public.profiles WHERE user_id = $1 FOR UPDATE', [session.user.id])
    const profile = profileResult.rows[0]
    if (!profile) {
      await client.query('ROLLBACK')
      return Response.json({ error: 'No encontramos tu perfil.' }, { status: 404 })
    }
    if (profile.credits_balance < 5) {
      await client.query('ROLLBACK')
      return Response.json({ error: 'Necesitas al menos 5 créditos para crear este estudio.' }, { status: 402 })
    }

    const typeResult = await client.query('SELECT id FROM public.study_types WHERE code = $1', [code])
    const studyType = typeResult.rows[0]
    if (!studyType) {
      await client.query('ROLLBACK')
      return Response.json({ error: 'Este tipo de estudio no está disponible.' }, { status: 404 })
    }

    const resultData = simulatedResult(code, inputData)
    const study = await client.query(`INSERT INTO public.studies (user_id, study_type_id, title, status, input_data, result_data, credits_spent) VALUES ($1, $2, $3, 'completed', $4::jsonb, $5::jsonb, 5) RETURNING id`, [profile.id, studyType.id, config.title, JSON.stringify(inputData), JSON.stringify(resultData)])
    await client.query(`INSERT INTO public.credit_transactions (user_id, type, amount, reference_id, description) VALUES ($1, 'consumption', -5, $2, $3)`, [profile.id, study.rows[0].id, `Consumo de 5 créditos: ${config.label}`])
    const updated = await client.query('UPDATE public.profiles SET credits_balance = credits_balance - 5 WHERE id = $1 RETURNING credits_balance', [profile.id])
    await client.query('COMMIT')
    return Response.json({ studyId: study.rows[0].id, creditsBalance: updated.rows[0].credits_balance, status: 'completed', resultData })
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {})
    console.error('[v0] Error creating study:', error)
    return Response.json({ error: 'No pudimos guardar el estudio.' }, { status: 500 })
  } finally {
    client.release()
  }
}
