import { matchCondition } from '@/components/nextekit/auth/util'
import { match } from '@/components/nextekit/utils'
import acceptLanguageParser from 'accept-language-parser'
import { type NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextResponse } from 'next/server'

import { authProps } from './config/auth-props'
import { localeConfig } from './locale/config'

const mwLocale = (request: NextRequestWithAuth, response: NextResponse) => {
  if (match(request.nextUrl.pathname, ['/((?!api/).*)'])) {
    console.debug('mw:locale')
    if (request.method.toUpperCase() === 'GET') {
      if (!request.cookies.has(localeConfig.cookie.name)) {
        const detectedLang =
          acceptLanguageParser.pick(
            localeConfig.locales,
            request.headers.get('accept-language') ?? localeConfig.locales[0],
            {
              loose: true,
            },
          ) ?? localeConfig.locales[0]

        console.debug('set locale cookie:', detectedLang)
        response.cookies.set({
          name: localeConfig.cookie.name,
          value: detectedLang,
          httpOnly: false,
          maxAge: localeConfig.cookie.maxAge,
        })
      }
    }
  }
}

const middlewareWithAuth = withAuth(
  async (request) => {
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
        console.debug('mw:token:', JSON.stringify(token))
        // 管理者権限の確認
        if (matchCondition(req.nextUrl.pathname, authProps.targetAdmin)) {
          console.debug('check admin:', token?.isAdmin)
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
    console.debug('mw:auth')
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
