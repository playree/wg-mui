'use client'

import { AuthProvider } from '@/components/nextekit/auth'
import { LocaleProvider } from '@/components/nextekit/locale/client'
import { authProps } from '@/config/auth'
import { localeConfig } from '@/locale/config'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import * as React from 'react'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider {...themeProps}>
        <AuthProvider authProps={authProps}>
          <LocaleProvider config={localeConfig}>{children}</LocaleProvider>
        </AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
