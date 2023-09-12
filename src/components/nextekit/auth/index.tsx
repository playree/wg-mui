import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import React, { FC, useEffect } from 'react'

import { MatchCondition, matchCondition } from './util'

export type AuthProps = {
  targetAuth?: MatchCondition
  targetAdmin?: MatchCondition
}

export const AuthHandler: FC<{ children: React.ReactNode; authProps: AuthProps }> = ({ children, authProps }) => {
  const { status, data: session } = useSession()
  const pathname = usePathname()
  const requireAuth = matchCondition(pathname, authProps.targetAuth)
  console.debug('auth:handle:', pathname, requireAuth)

  useEffect(() => {
    console.debug('requireAuth: ', requireAuth, status)
    if (requireAuth && status === 'unauthenticated') {
      signIn()
    }
  }, [requireAuth, status])

  useEffect(() => {
    if (session) {
      console.debug('authenticated:', session)
    }
  }, [session])

  if (!requireAuth) {
    // 認証不要
    return children
  }

  if (status === 'authenticated') {
    if (matchCondition(pathname, authProps.targetAdmin) && !session.user.isAdmin) {
      // 管理者権限が不足
      signIn()
      return <></>
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
