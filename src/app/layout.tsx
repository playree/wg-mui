import { SideNavbar } from '@/components/nextekit/ui/SideNavbar'
import { fontSans } from '@/config/fonts'
import { siteConfig } from '@/config/site'
import '@/styles/globals.css'
import clsx from 'clsx'
import { Metadata } from 'next'
import { Noto_Sans_JP, Roboto_Mono } from 'next/font/google'

import { Menu } from './menu'
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
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
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
      <body className={clsx('font-noto min-h-screen bg-background antialiased', fontSans.variable)}>
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className='relative flex h-screen flex-col'>
            <SideNavbar menu={<Menu />} className='bg-white dark:bg-black'>
              {children}
            </SideNavbar>
          </div>
        </Providers>
      </body>
    </html>
  )
}
