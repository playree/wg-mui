'use client'

import { AuthProvider } from '@/components/nextekit/auth'
import { LocaleProvider } from '@/components/nextekit/locale/client'
import { authProps } from '@/config/auth-props'
import { localeConfig } from '@/locale/config'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import { FC, ReactNode } from 'react'

export interface ProvidersProps {
  children: ReactNode
  themeProps?: ThemeProviderProps
}

export const Providers: FC<ProvidersProps> = ({ children, themeProps }) => {
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
