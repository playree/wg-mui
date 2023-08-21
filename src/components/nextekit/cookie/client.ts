'use client'

import { CookieSerializeOptions, serialize } from 'cookie'

export const getCookies = () => {
  const cookies: Record<string, string> = {}
  const documentCookies = document.cookie ? document.cookie.split(';') : []
  for (const cookieKV of documentCookies) {
    const kv = cookieKV.trim().split(/(?<=^[^=]+?)=/)
    cookies[kv[0]] = kv[1]
  }
  return cookies
}

export const getCookie = (key: string) => getCookies()[key]

export const setCookie = (key: string, value: string, options?: CookieSerializeOptions) => {
  document.cookie = serialize(key, value, options)
}
