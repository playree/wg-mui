import { matchCondition } from '@/components/nextekit/auth/util'
import { match } from '@/components/nextekit/utils'
import { type NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextResponse } from 'next/server'

import { authProps } from './config/auth-props'
import { localeConfig } from './locale/config'

const mwLocale = (request: NextRequestWithAuth, response: NextResponse) => {
  if (match(request.nextUrl.pathname, ['/((?!api/).*)'])) {
    console.debug('mw:locale')
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
    if (request.nextauth.token?.oauth) {
      const oauth = request.nextauth.token.oauth
      if (oauth.type === 'google') {
        // Google連携
        return NextResponse.redirect(new URL(`/linkgoogle/${oauth.onetime}`, request.url))
      }
      const url = request.nextUrl.clone()
      url.pathname = '/404'
      return NextResponse.rewrite(url)
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
        return !!token
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - xxx.xxx (file)
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|api/auth/|.*\\.).*)',
  ],
}
