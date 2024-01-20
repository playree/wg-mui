import { checkPassword } from '@/helpers/password'
import { prisma } from '@/helpers/prisma'
import { NextAuthOptions, Session, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.debug('authorize:', credentials)
        const name = credentials?.username
        const password = credentials?.password || ''

        // パスワード認証
        const user = await prisma.user.findUnique({ where: { name } })
        if (!user) {
          return null
        }
        if (checkPassword(password, user.passwordHash)) {
          return { id: user.id }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn(param) {
      console.debug('callbacks:signIn:', param)
      return true
    },
    async jwt({ token }) {
      if (token.sub) {
        const user = await prisma.user.findUnique({ where: { id: token.sub } })
        if (user) {
          token.name = user.name
          token.isAdmin = user.isAdmin
          token.isNotInit = user.isNotInit
          token.email = user.email
          console.debug('set token:', token)
        } else {
          console.debug('user not found')
          token.sub = undefined
        }
      }
      return token
    },
    async session({ token, session }) {
      if (token.sub) {
        session.user.id = token.sub
        session.user.name = token.name
        session.user.isNotInit = token.isNotInit
        session.user.isAdmin = token.isAdmin
        session.user.email = token.email
        console.debug('set session:', session.user)
      } else {
        return undefined as unknown as Session
      }
      return session
    },
  },
}

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}
