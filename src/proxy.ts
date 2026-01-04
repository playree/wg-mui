import { NextRequest, NextResponse } from 'next/server'
import { auth } from './auth'

import { type NextAuthRequest } from 'next-auth'
import { matchCondition } from './components/nextekit/auth/utils'
import { authProps } from './config/auth-props'
import { localeConfig } from './locale/config'

const regexLocale = /^\/(?!api\/).*$/
const mwLocale = (request: NextAuthRequest, response: NextResponse) => {
  if (regexLocale.test(request.nextUrl.pathname)) {
    console.debug('mw:locale', request.nextUrl.pathname)
    if (request.method.toUpperCase() === 'GET') {
      if (!request.cookies.has(localeConfig.cookie.name)) {
        // ロケールCookieが存在しない場合かつ、ユーザーのロケールが取得できる場合にはCookieを発行
        if (request.auth?.user?.locale) {
          console.debug('set locale cookie:', request.auth.user.locale)
          response.cookies.set({
            name: localeConfig.cookie.name,
            value: request.auth.user.locale,
            path: '/',
            httpOnly: false,
            maxAge: localeConfig.cookie.maxAge,
          })
        }
      }
    }
  }
}

export const proxyWithAuth = auth((request: NextAuthRequest) => {
  console.debug('mw:auth:', request.auth)
  // 連携シーケンス
  if (request.auth?.user?.oauth?.onetime) {
    console.debug('mw:oauth:', request.auth.user.oauth.onetime)
    return NextResponse.redirect(new URL(`/oauth/${request.auth.user.oauth.onetime}`, request.url))
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  mwLocale(request, response)
  return response
})

export const proxy = (request: NextRequest) => {
  console.debug('mw:start:', request.url, request.method)

  if (matchCondition(request.nextUrl.pathname, authProps.targetAuth)) {
    return proxyWithAuth(request, { params: new Promise(() => {}) })
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  // mwLocale(request, response)
  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!_next/static|_next/image|_next/webpack-hmr|api/auth/|.*\\.).*)',
      missing: [
        // Server Actions を除外する
        { type: 'header', key: 'next-action' },
      ],
    },
  ],
}
