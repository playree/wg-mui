import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    name: string
    isAdmin: boolean
    locale?: string
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
    oauth?: string
  }
}
