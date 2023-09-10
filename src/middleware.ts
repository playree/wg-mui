import acceptLanguageParser from 'accept-language-parser'
import { type NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextResponse } from 'next/server'
import { pathToRegexp } from 'path-to-regexp'

import { localeConfig } from './locale/config'

const matchers = {
  locale: ['/((?!api/).*)'],
}

const match = (matcher: string[], path: string) => {
  for (const regex of matcher) {
    const regexp = pathToRegexp(regex)
    if (regexp.exec(path)) {
      return true
    }
  }
  return false
}

const middlewareWithAuth = withAuth(
  (request) => {
    console.debug('mw:', request.url, request.method)

    // Locale
    if (match(matchers.locale, request.url)) {
      console.debug('locale:')
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
  { pages: { signIn: '/auth/signin' } },
)

export const middleware = (request: NextRequestWithAuth, event: NextFetchEvent) => {
  return middlewareWithAuth(request, event)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - xxx.xxx (file)
     */
    '/((?!_next/static|_next/image|.*\\.).*)',
  ],
}
