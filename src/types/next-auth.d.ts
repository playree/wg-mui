import 'next-auth'

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
