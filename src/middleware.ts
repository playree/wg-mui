import { matchCondition } from '@/components/nextekit/auth/utils'
import { type NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextResponse } from 'next/server'

import { authProps } from './config/auth-props'
import { localeConfig } from './locale/config'

const regexLocale = /^\/(?!api\/).*$/
const mwLocale = (request: NextRequestWithAuth, response: NextResponse) => {
  // if (match(request.nextUrl.pathname, ['/((?!api/).*)'])) {
  if (regexLocale.test(request.nextUrl.pathname)) {
    console.debug('mw:locale', request.nextUrl.pathname)
    if (request.method.toUpperCase() === 'GET') {
      if (!request.cookies.has(localeConfig.cookie.name)) {
        // ロケールCookieが存在しない場合かつ、ユーザーのロケールが取得できる場合にはCookieを発行
        if (request.nextauth?.token?.locale) {
          console.debug('set locale cookie:', request.nextauth.token.locale)
          response.cookies.set({
            name: localeConfig.cookie.name,
            value: request.nextauth.token.locale,
            path: '/',
            httpOnly: false,
            maxAge: localeConfig.cookie.maxAge,
          })
        }
      }
    }
  }
}

const middlewareWithAuth = withAuth(
  async (request) => {
    // 連携シーケンス
    if (request.nextauth.token?.oauth?.onetime) {
      return NextResponse.redirect(new URL(`/oauth/${request.nextauth.token.oauth.onetime}`, request.url))
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', request.nextUrl.pathname)
    const response = NextResponse.next({ request: { headers: requestHeaders } })
    mwLocale(request, response)
    return response
  },
  {
    pages: { signIn: '/auth/signin' },
    callbacks: {
      authorized({ req, token }) {
        console.debug('mw:auth:token:', JSON.stringify(token))

        if (token?.oauth) {
          // 連携シーケンスの場合は一旦通過
          return true
        }

        // 管理者権限の確認
        if (matchCondition(req.nextUrl.pathname, authProps.targetAdmin)) {
          console.debug('mw:auth:admin:', token?.isAdmin)
          return token?.isAdmin === true
        }
        return !!token?.sub
      },
    },
  },
)

export const middleware = (request: NextRequestWithAuth, event: NextFetchEvent) => {
  console.debug('mw:start:', request.url, request.method)

  if (matchCondition(request.nextUrl.pathname, authProps.targetAuth)) {
    return middlewareWithAuth(request, event)
  }

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', request.nextUrl.pathname)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  mwLocale(request, response)
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
