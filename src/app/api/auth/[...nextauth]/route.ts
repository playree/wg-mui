import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

const authOptions: NextAuthOptions = {
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

        // dummy
        if (name === 'test' && password == 'test') {
          return { id: 'testid' }
        }
        return null
      },
    }),
  ],
  // pages: {
  //   signIn: '/auth/signin',
  // },
  callbacks: {
    async signIn(param) {
      console.debug('signIn:', param)
      return true
    },
    async session({ token, session }) {
      if (token.sub) {
        //
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
