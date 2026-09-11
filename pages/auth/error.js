import { useRouter } from 'next/router'

export default function AuthError() {
  const { query } = useRouter()
  return <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground"><section className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-card"><p className="font-mono text-xs uppercase tracking-widest text-secondary">Auth / error</p><h1 className="mt-4 font-heading text-3xl font-semibold">No pudimos completar el acceso</h1><p className="mt-3 text-sm leading-relaxed text-muted-foreground">Revisa tus credenciales o inténtalo de nuevo. Código: {query.error || 'desconocido'}.</p><a href="/auth/signin" className="mt-8 inline-flex rounded-md bg-primary px-5 py-3 font-heading text-sm font-bold text-primary-foreground shadow-glow">Volver al acceso</a></section></main>
}
