import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    name: string
    isAdmin: boolean
    isNotInit: boolean
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      isNotInit: boolean
      isAdmin: boolean
      email?: string | null
    }
  }
}
