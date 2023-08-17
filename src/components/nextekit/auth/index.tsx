import { SessionProvider, signIn, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
import React, { FC, useEffect } from 'react'

export type AuthProps = {
  whiteList: string[]
  requireAdminList: string[]
}

export const AuthHandler: FC<{ children: React.ReactNode; authProps: AuthProps }> = ({ children, authProps }) => {
  const { status, data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const requireAuth = !authProps.whiteList.includes(pathname)
  console.debug('pathname:', pathname)

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
    if (authProps.requireAdminList.includes(pathname) && !session.user.isAdmin) {
      // 管理者権限が不足
      router.replace('/')
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
