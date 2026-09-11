import { ProfileCard } from '@/components/profile-card'
import { ProfileForm } from '@/components/profile-form'

export default function DashboardPage() {
  return <div className="flex flex-col gap-10"><div className="max-w-2xl"><p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Centro de control</p><h1 className="mt-3 text-balance font-heading text-4xl font-semibold tracking-tight md:text-5xl">Tu espacio cósmico</h1><p className="mt-4 text-pretty leading-6 text-muted-foreground">Gestiona tu identidad astral y prepara los datos para tus próximos estudios.</p></div><div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]"><ProfileCard /><ProfileForm /></div></div>
}
