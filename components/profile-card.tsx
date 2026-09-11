'use client'

import useSWR from 'swr'
import { CalendarDays, Coins, Mail, UserRound } from 'lucide-react'

export type Profile = {
  full_name: string | null
  email: string
  birth_date: string | null
  birth_time: string | null
  birth_place: string | null
  credits_balance: number
  created_at: string
}

const fetcher = (url: string) => fetch(url).then(async (response) => {
  if (!response.ok) throw new Error('No se pudo cargar el perfil')
  return response.json()
})

export function useProfile() {
  return useSWR<{ profile: Profile }>('/api/profile/me', fetcher, { revalidateOnFocus: false })
}

export function ProfileCard() {
  const { data, error, isLoading } = useProfile()
  if (isLoading) return <div className="h-64 animate-pulse rounded-lg border border-border bg-card" aria-label="Cargando perfil" />
  if (error || !data?.profile) return <div className="rounded-lg border border-destructive/40 bg-card p-6 text-sm text-destructive">No se pudo cargar tu perfil.</div>

  const profile = data.profile
  const joined = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(profile.created_at))
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Identidad</p><h2 className="mt-2 font-heading text-2xl font-semibold">{profile.full_name || 'Astronauta'}</h2></div>
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary"><UserRound aria-hidden="true" /></div>
      </div>
      <div className="mt-8 flex flex-col gap-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-3"><Mail className="size-4 text-primary" aria-hidden="true" />{profile.email}</p>
        <p className="flex items-center gap-3"><CalendarDays className="size-4 text-primary" aria-hidden="true" />Miembro desde {joined}</p>
      </div>
      <div className="mt-8 flex items-center justify-between rounded-md border border-border bg-background p-4"><span className="flex items-center gap-2 text-sm text-muted-foreground"><Coins className="size-4 text-primary" aria-hidden="true" />Saldo disponible</span><strong className="font-heading text-2xl text-primary">{profile.credits_balance}</strong></div>
    </section>
  )
}
