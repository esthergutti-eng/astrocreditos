import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'
import pool from '../../../lib/db'

async function findOrCreateProfile(user) {
  const existing = await pool.query(
    'SELECT p.id, p.user_id, p.full_name, p.email, p.credits_balance FROM public.profiles p WHERE p.user_id = $1 LIMIT 1',
    [user.id],
  )
  if (existing.rows[0]) return existing.rows[0]

  // profiles.id remains constrained to neon_auth.user(id) from Fase 1.
  const neonProfile = await pool.query(
    'SELECT id FROM neon_auth.user WHERE lower(email) = lower($1) LIMIT 1',
    [user.email],
  )
  if (!neonProfile.rows[0]) return null

  const created = await pool.query(
    `INSERT INTO public.profiles (id, user_id, email, full_name)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET user_id = EXCLUDED.user_id, email = EXCLUDED.email, full_name = EXCLUDED.full_name
     RETURNING id, user_id, full_name, email, credits_balance`,
    [neonProfile.rows[0].id, user.id, user.email, user.name || null],
  )
  return created.rows[0] || null
}

async function upsertUser({ email, name, googleId, passwordHash }) {
  const result = await pool.query(
    `INSERT INTO public.users (email, name, google_id, password_hash)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (email) DO UPDATE SET
       name = COALESCE(EXCLUDED.name, public.users.name),
       google_id = COALESCE(EXCLUDED.google_id, public.users.google_id)
     RETURNING id, email, name`,
    [email, name || null, googleId || null, passwordHash || null],
  )
  return result.rows[0]
}

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin', error: '/auth/error' },
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: { email: { label: 'Email', type: 'email' }, password: { label: 'Contraseña', type: 'password' } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const result = await pool.query('SELECT id, email, name, password_hash FROM public.users WHERE lower(email) = lower($1) LIMIT 1', [credentials.email])
        const user = result.rows[0]
        if (!user?.password_hash || !(await bcrypt.compare(credentials.password, user.password_hash))) return null
        return { id: user.id, email: user.email, name: user.name }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false
      const persisted = await upsertUser({ email: user.email, name: user.name, googleId: account?.provider === 'google' ? account.providerAccountId : null })
      user.id = persisted.id
      await findOrCreateProfile({ ...user, id: persisted.id })
      return true
    },
    async jwt({ token, user }) {
      if (user) token.userId = user.id
      if (token.userId) {
        const profile = await pool.query('SELECT id, user_id, full_name, credits_balance, birth_date, birth_time, birth_place FROM public.profiles WHERE user_id = $1 LIMIT 1', [token.userId])
        token.profile = profile.rows[0] || null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.userId
        session.user.profile = token.profile || null
      }
      return session
    },
  },
})
