'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

const fieldLabels = {
  birthDate: 'Fecha de nacimiento',
  birthTime: 'Hora de nacimiento',
  birthPlace: 'Lugar de nacimiento',
  personOneName: 'Nombre de la primera persona',
  personOneDate: 'Fecha de nacimiento de la primera persona',
  personOneTime: 'Hora de nacimiento de la primera persona',
  personOnePlace: 'Lugar de nacimiento de la primera persona',
  personTwoName: 'Nombre de la segunda persona',
  personTwoDate: 'Fecha de nacimiento de la segunda persona',
  personTwoTime: 'Hora de nacimiento de la segunda persona',
  personTwoPlace: 'Lugar de nacimiento de la segunda persona',
  currentPlace: 'Lugar actual',
}

export function StudyForm({ studyType, title, description, fields }) {
  const { data: session, update } = useSession()
  const [values, setValues] = useState(Object.fromEntries(fields.map((field) => [field, ''])))
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [offline, setOffline] = useState(false)
  const serverCredits = session?.user?.profile?.credits_balance ?? 0
  const [localCredits, setLocalCredits] = useState(serverCredits)
  const credits = localCredits

  useEffect(() => {
    const updateConnection = () => setOffline(!navigator.onLine)
    updateConnection()
    window.addEventListener('online', updateConnection)
    window.addEventListener('offline', updateConnection)
    return () => {
      window.removeEventListener('online', updateConnection)
      window.removeEventListener('offline', updateConnection)
    }
  }, [])

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    if (credits < 5) {
      setError('Necesitas al menos 5 créditos para crear este estudio.')
      return
    }
    if (Object.values(values).some((value) => !value.trim())) {
      setError('Completa todos los campos para continuar.')
      return
    }

    if (!navigator.onLine) {
      setOffline(true)
      setError('No hay conexión. Revisa tu red e inténtalo de nuevo.')
      return
    }
    setLocalCredits((current) => current - 5)
    setStatus('instant')
    let data = null
    let response = null
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        response = await fetch('/api/studies/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studyType, inputData: values }) })
        data = await response.json()
        break
      } catch {
        if (attempt === 2) {
          setOffline(!navigator.onLine)
          setLocalCredits((current) => current + 5)
          setStatus('idle')
          setError(navigator.onLine ? 'No pudimos conectar con el servidor. Inténtalo de nuevo.' : 'Sin conexión. Revisa tu red y reintenta.')
          return
        }
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)))
      }
    }
    if (!response?.ok) {
      setLocalCredits((current) => current + 5)
      setStatus('idle')
      setError(data?.error || 'No pudimos crear el estudio.')
      return
    }
    setLocalCredits(data.creditsBalance)
    setResult(data.resultData)
    setStatus('complete')
    await update({ profile: { ...session.user.profile, credits_balance: data.creditsBalance } })
  }

  return <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
    <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-7">
      <div className="mb-6"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Estudio de {title.toLowerCase()}</p><h2 className="mt-2 font-heading text-2xl font-semibold">Tus datos</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => <label key={field} className="flex flex-col gap-2 text-sm font-medium"><span>{fieldLabels[field]}</span><input required value={values[field]} onChange={(event) => updateField(field, event.target.value)} type={field.toLowerCase().includes('date') ? 'date' : field.toLowerCase().includes('time') ? 'time' : 'text'} className="h-11 rounded-md border border-input bg-background px-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>)}
      </div>
      {offline && <p role="status" className="mt-4 rounded-md border border-accent/30 bg-accent/10 px-3 py-2 text-sm text-muted-foreground">Estás sin conexión. El estudio se reintentará cuando recuperes la red.</p>}
      {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === 'instant'} className="dark-tech-glow mt-6 w-full transition-all duration-200 hover:-translate-y-0.5">{status === 'instant' ? 'Generando tu estudio...' : 'Generar estudio · 5 créditos'}</Button>
    </form>
    <aside className="rounded-lg border border-border bg-card p-5 shadow-card sm:p-7"><div className="flex items-center justify-between"><p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Saldo disponible</p><span className="font-heading text-2xl font-semibold text-primary">{credits}</span></div>{status === 'idle' && <div className="mt-12"><p className="font-heading text-xl font-semibold">Listo para mirar las estrellas</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Completa tus datos y recibirás una lectura instantánea. El resultado es una simulación de showcase mientras conectamos el motor astrológico real.</p></div>}{status === 'instant' && <div className="mt-12"><p className="font-heading text-xl font-semibold text-primary">Tu estudio está tomando forma</p><p className="mt-3 text-sm leading-6 text-muted-foreground">Hemos reservado tus créditos. Estamos preparando tu lectura...</p></div>}{status === 'complete' && result && <div className="mt-8"><p className="font-heading text-xl font-semibold">Resultado listo</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Estudio guardado con posiciones planetarias simuladas.</p><div className="mt-5 flex flex-col gap-2">{result.planetaryPositions.map((planet) => <div key={planet.planet} className="flex items-center justify-between rounded-md border border-border bg-secondary px-3 py-2 text-sm"><span>{planet.planet}</span><span className="text-muted-foreground">{planet.sign} · {planet.degree}° · Casa {planet.house}</span></div>)}</div><p className="mt-5 text-xs leading-5 text-muted-foreground">{result.note}</p></div>}</aside>
  </div>
}
