import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth/jwt' {
  interface JWT {
    name: string
    isAdmin: boolean
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      isAdmin: boolean
      email?: string | null
    }
  }
}
