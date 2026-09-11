'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import { Profile, useProfile } from './profile-card'

export function ProfileForm() {
  const { data, isLoading } = useProfile()
  const { mutate } = useSWRConfig()
  const [form, setForm] = useState({ full_name: '', birth_date: '', birth_time: '', birth_place: '' })
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => { if (data?.profile) { const p = data.profile; setForm({ full_name: p.full_name || '', birth_date: p.birth_date || '', birth_time: p.birth_time?.slice(0, 5) || '', birth_place: p.birth_place || '' }) } }, [data])
  function update(field: keyof typeof form, value: string) { setForm((current) => ({ ...current, [field]: value })) }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setMessage('')
    const response = await fetch('/api/profile/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const result = await response.json()
    if (!response.ok) setMessage(result.error || 'No se pudo guardar')
    else { await mutate('/api/profile/me', { profile: result.profile }, { revalidate: false }); setMessage('Perfil actualizado correctamente') }
    setSaving(false)
  }
  if (isLoading) return <div className="h-96 animate-pulse rounded-lg border border-border bg-card" aria-label="Cargando formulario" />
  return <section className="rounded-lg border border-border bg-card p-6 shadow-card"><div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Datos natales</p><h2 className="mt-2 font-heading text-2xl font-semibold">Tu perfil cósmico</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Completa estos datos para preparar tus futuros estudios.</p></div><form onSubmit={submit} className="mt-8 flex flex-col gap-5"><label className="flex flex-col gap-2 text-sm font-medium">Nombre completo<input required value={form.full_name} onChange={(e) => update('full_name', e.target.value)} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium">Email<span className="rounded-md border border-border bg-muted px-3 py-3 text-muted-foreground">{data?.profile.email}</span></label><div className="grid gap-5 sm:grid-cols-2"><label className="flex flex-col gap-2 text-sm font-medium">Fecha de nacimiento<input type="date" value={form.birth_date} onChange={(e) => update('birth_date', e.target.value)} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label><label className="flex flex-col gap-2 text-sm font-medium">Hora de nacimiento<input type="time" value={form.birth_time} onChange={(e) => update('birth_time', e.target.value)} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label></div><label className="flex flex-col gap-2 text-sm font-medium">Lugar de nacimiento<input value={form.birth_place} onChange={(e) => update('birth_place', e.target.value)} className="rounded-md border border-border bg-background px-3 py-3 outline-none focus:border-primary" /></label>{message && <p role="status" className={message.includes('correctamente') ? 'text-sm text-emerald-400' : 'text-sm text-destructive'}>{message}</p>}<button disabled={saving} className="rounded-md bg-primary px-4 py-3 font-heading text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60">{saving ? 'Guardando…' : 'Guardar cambios'}</button></form></section>
}
