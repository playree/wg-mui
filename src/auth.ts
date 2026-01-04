import NextAuth from 'next-auth'

import { authConfig } from './config/auth.config'

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 86400 },
  ...authConfig,
})

export const getSessionUser = async () => {
  const session = await auth()
  return session?.user
}
