import bcrypt from 'bcryptjs'
import pool from '../../../lib/db'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })
  const { email, password, name } = req.body || {}
  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email) || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Introduce un email válido y una contraseña de al menos 8 caracteres.' })
  }
  try {
    const passwordHash = await bcrypt.hash(password, 12)
    const result = await pool.query('INSERT INTO public.users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name', [email.trim().toLowerCase(), passwordHash, typeof name === 'string' ? name.trim() : null])
    return res.status(201).json({ user: result.rows[0] })
  } catch (error) {
    if (error?.code === '23505') return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' })
    return res.status(500).json({ error: 'No se pudo crear la cuenta.' })
  }
}
