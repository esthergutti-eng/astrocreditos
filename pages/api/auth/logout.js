import { serialize } from 'cookie'

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Método no permitido' })
  const cookieNames = ['next-auth.session-token', '__Secure-next-auth.session-token']
  res.setHeader('Set-Cookie', cookieNames.map((name) => serialize(name, '', { httpOnly: true, expires: new Date(0), path: '/', secure: name.startsWith('__Secure-') })))
  return res.redirect(302, '/auth/signin')
}
