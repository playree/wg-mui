import { SessionProvider, signIn, useSession } from 'next-auth/react'
import DefaultErrorPage from 'next/error'
import { usePathname } from 'next/navigation'
import React, { FC, useEffect } from 'react'

import { MatchCondition, matchCondition } from './utils'

export type AuthProps = {
  targetAuth?: MatchCondition
  targetAdmin?: MatchCondition
}

const AuthHandler: FC<{ children: React.ReactNode; authProps: AuthProps }> = ({ children, authProps }) => {
  const { status, data: session } = useSession()
  const pathname = usePathname()
  const requireAuth = matchCondition(pathname, authProps.targetAuth)

  useEffect(() => {
    console.debug('requireAuth: ', pathname, requireAuth, status)
    if (requireAuth) {
      if (status === 'unauthenticated') {
        signIn()
      }
      if (status === 'authenticated') {
        if (session?.user === undefined) {
          signIn()
        } else {
          console.debug('authenticated:', session)
        }
      }
    }
  }, [pathname, requireAuth, session, status])

  if (status !== 'loading' && !requireAuth) {
    // 認証不要
    return children
  }

  if (status === 'authenticated' && session.user) {
    if (matchCondition(pathname, authProps.targetAdmin) && !session.user?.isAdmin) {
      // 管理者権限が不足
      return <DefaultErrorPage statusCode={403} />
    }
    return children
  }

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-xl bg-blue-600'></div>
      <div className='ml-4 font-bold'>Loading...</div>
    </div>
  )
}

export const AuthProvider: FC<{ children: React.ReactNode; authProps: AuthProps }> = ({ children, authProps }) => {
  return (
    <SessionProvider>
      <AuthHandler authProps={authProps}>{children}</AuthHandler>
    </SessionProvider>
  )
}
