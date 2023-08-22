import acceptLanguageParser from 'accept-language-parser'
import { type NextRequest, NextResponse } from 'next/server'

import { localeConfig } from './locale/config'

export function middleware(request: NextRequest) {
  console.debug('mw:', request.url, request.method)

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

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|.*\\.).*)',
  ],
}
