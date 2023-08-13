'use client'

import { AuthProps, AuthProvider } from '@/components/nextuikit/auth'
import { NextUIProvider } from '@nextui-org/system'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'
import * as React from 'react'

export interface ProvidersProps {
  children: React.ReactNode
  themeProps?: ThemeProviderProps
}

const authProps: AuthProps = {
  whiteList: ['/auth/signin', '/docs'],
  requireAdminList: [],
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextUIProvider>
      <NextThemesProvider {...themeProps}>
        <AuthProvider authProps={authProps}>{children}</AuthProvider>
      </NextThemesProvider>
    </NextUIProvider>
  )
}
