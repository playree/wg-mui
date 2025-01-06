import type { OAuthType } from '@/helpers/env'
import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    name: string
    isAdmin: boolean
    locale?: string
    oauth?: {
      type: OAuthType
      onetime: string
    }
    isError?: boolean
  }
}

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      name: string
      isAdmin: boolean
      locale?: string
      email?: string | null
    }
    isError?: boolean
  }
}
