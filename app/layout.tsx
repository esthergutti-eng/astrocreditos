import { Analytics } from '@vercel/analytics/next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthSessionProvider } from '@/components/session-provider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })
const jetBrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'AstroCréditos — Tu mapa empieza aquí',
  description: 'Genera tu carta astral, tu sinastría o tu revolución solar en minutos.',
  generator: 'AstroCréditos',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0A0A0F',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}>
      <body className="antialiased"><AuthSessionProvider>{children}</AuthSessionProvider>{process.env.NODE_ENV === 'production' && <Analytics />}</body>
    </html>
  )
}
