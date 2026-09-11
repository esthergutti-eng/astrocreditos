'use client'

import { signOut } from 'next-auth/react'

export function LogoutButton() {
  return <button type="button" onClick={() => signOut({ callbackUrl: '/auth/signin' })} className="text-sm text-muted-foreground transition-colors hover:text-primary">Cerrar sesión</button>
}
