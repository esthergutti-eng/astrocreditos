import { getProviders, signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function SignIn({ providers }) {
  const router = useRouter()
  const { status } = useSession()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  useEffect(() => { if (status === 'authenticated') router.replace('/') }, [status, router])
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    if (result?.error) setError('Email o contraseña incorrectos.')
    else router.push('/')
    setLoading(false)
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground"><section className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-card"><a href="/" className="font-heading text-sm font-bold">Astro<span className="text-primary">Créditos</span></a><h1 className="mt-10 font-heading text-3xl font-semibold">Bienvenido de nuevo</h1><p className="mt-2 text-sm text-muted-foreground">Accede a tu espacio cósmico.</p>{providers?.google && <button onClick={() => signIn('google')} className="mt-8 w-full rounded-md border border-border px-4 py-3 font-heading text-sm font-semibold transition-colors hover:border-primary hover:text-primary">Continuar con Google</button>}<div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o con email<span className="h-px flex-1 bg-border" /></div><form onSubmit={submit} className="flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium">Contraseña<input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={loading} className="rounded-md bg-primary px-4 py-3 font-heading text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">{loading ? 'Entrando…' : 'Iniciar sesión'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">¿Aún no tienes cuenta? <a href="/auth/signup" className="text-primary hover:underline">Crear cuenta</a></p></section></main>
}

export async function getServerSideProps(context) { return { props: { providers: await getProviders(context) } } }
