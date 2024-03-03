import { getAppName } from '@/helpers/env'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Noto_Sans_JP, Roboto_Mono } from 'next/font/google'
import { twMerge } from 'tailwind-merge'

import { Providers } from './providers'

const NotoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans-jp',
})

const RobotoMono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const metadata: Metadata = {
  title: {
    default: 'WireGuard Managenent UI',
    template: `%s - ${getAppName() || 'WG MUI'}`,
  },
  description: 'WireGuard Managenent UI',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja' className={`${NotoSansJp.variable} ${RobotoMono.variable}`} suppressHydrationWarning>
      <head />
      <body className={twMerge('min-h-screen bg-background font-noto antialiased')}>
        <Providers themeProps={{ attribute: 'class' }}>
          <div className='relative flex h-screen flex-col'>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
