import { matchCondition } from '@/components/nextekit/auth/util'
import { match } from '@/components/nextekit/utils'
import acceptLanguageParser from 'accept-language-parser'
import { type NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextResponse } from 'next/server'

import { authProps } from './config/auth'
import { localeConfig } from './locale/config'

const middlewareWithAuth = withAuth(
  (request) => {
    // Locale
    if (match(request.url, ['/((?!api/).*)'])) {
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
          const response = NextResponse.next()
          response.cookies.set({
            name: localeConfig.cookie.name,
            value: detectedLang,
            httpOnly: false,
            maxAge: localeConfig.cookie.maxAge,
          })
          return response
        }
      }
    }
  },
  {
    pages: { signIn: '/auth/signin' },
    callbacks: {
      authorized({ req, token }) {
        // 管理者権限の確認
        if (matchCondition(req.nextUrl.pathname, authProps.targetAdmin)) {
          console.log('check admin:', token)
          return token?.isAdmin === true
        }
        return true
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
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - xxx.xxx (file)
     */
    '/((?!_next/static|_next/image|api/auth/|.*\\.).*)',
  ],
}
