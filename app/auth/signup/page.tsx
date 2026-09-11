'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const response = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await response.json()
    if (!response.ok) { setError(data.error || 'No se pudo crear la cuenta.'); setLoading(false); return }
    const result = await signIn('credentials', { email: form.email, password: form.password, redirect: false })
    if (result?.error) {
      setError('La cuenta se creó, pero no pudimos iniciar tu sesión. Ve a Iniciar sesión.')
      setLoading(false)
      return
    }
    router.replace('/dashboard')
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 text-foreground"><section className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-card"><Link href="/" className="font-heading text-sm font-bold">Astro<span className="text-primary">Créditos</span></Link><h1 className="mt-10 font-heading text-3xl font-semibold">Crea tu cuenta</h1><p className="mt-2 text-sm text-muted-foreground">Empieza a explorar tu mapa.</p><form onSubmit={submit} className="mt-8 flex flex-col gap-4"><label className="flex flex-col gap-2 text-sm font-medium">Nombre<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium">Email<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium">Contraseña<input required minLength={8} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label>{error && <p role="alert" className="text-sm text-destructive">{error}</p>}<button disabled={loading} className="rounded-md bg-primary px-4 py-3 font-heading text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">{loading ? 'Creando…' : 'Crear cuenta'}</button></form><p className="mt-6 text-center text-sm text-muted-foreground">¿Ya tienes cuenta? <Link href="/auth/signin" className="text-primary hover:underline">Iniciar sesión</Link></p></section></main>
}
