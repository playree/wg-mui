'use client'

import { AuthProvider } from '@/components/nextekit/auth'
import { LocaleProvider } from '@/components/nextekit/locale/client'
import { authProps } from '@/config/auth-props'
import { localeConfig } from '@/locale/config'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { useRouter } from 'next/navigation'
import { FC, ReactNode } from 'react'

import { SharedUIProvider } from './context'

export interface ProvidersProps {
  children: ReactNode
  defaultLocale: string
  themeProps?: ThemeProviderProps
  acceptLanguage: string | null
}

export const Providers: FC<ProvidersProps> = ({ children, defaultLocale, themeProps, acceptLanguage }) => {
  const router = useRouter()

  return (
    <NextUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <AuthProvider authProps={authProps}>
          <LocaleProvider config={localeConfig} defaultLocale={defaultLocale} acceptLanguage={acceptLanguage}>
            <SharedUIProvider>{children}</SharedUIProvider>
          </LocaleProvider>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
