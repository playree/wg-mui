import { getAppName } from '@/helpers/env'
import { defaultLocale } from '@/locale/server'
import '@/styles/globals.css'
import { Metadata } from 'next'
import { Noto_Sans_JP, Roboto_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import { twMerge } from 'tailwind-merge'

import { ReactNode } from 'react'
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

export default async function RootLayout({ children }: { children: ReactNode }) {
  const acceptLanguage = (await headers()).get('accept-language')

  return (
    <html lang='ja' className={`${NotoSansJp.variable} ${RobotoMono.variable}`} suppressHydrationWarning>
      <head />
      <body className={twMerge('bg-background font-noto min-h-screen antialiased')}>
        <Providers themeProps={{ attribute: 'class' }} defaultLocale={defaultLocale} acceptLanguage={acceptLanguage}>
          <div className='relative flex h-screen flex-col'>{children}</div>
        </Providers>
      </body>
    </html>
  )
}
