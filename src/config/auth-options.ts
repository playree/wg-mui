import {
  getGitLabConfig,
  getGitLabUrl,
  getGoogleConfig,
  isGitLabEnabled,
  isGoogleEnabled,
  isGoogleSimpleLogin,
} from '@/helpers/env'
import { checkPassword } from '@/helpers/password'
import { prisma } from '@/helpers/prisma'
import { NextAuthOptions, Profile, Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { GitLabSelfProvider } from './gitlab-self-provider'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.debug('authorize:', credentials)
        const name = credentials?.username || ''
        const password = credentials?.password || ''

        // @を含む場合はメールアドレスとして認証
        const where = name.indexOf('@') > -1 ? { email: name } : { name }

        // パスワード認証
        const user = await prisma.user.findUnique({ where })
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
  session: {
    maxAge: 86400,
  },
  jwt: {
    maxAge: 86400,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      console.debug('callbacks:signIn:', { provider: account?.provider, id: user.id })
      return true
    },
    async jwt(param) {
      const { token, account } = param

      let user
      if (account?.provider === 'google') {
        const profile: (Profile & { email_verified?: boolean }) | undefined = param.profile
        if (token.sub && profile?.email_verified && profile?.email) {
          if (isGoogleSimpleLogin()) {
            // 簡易連携の場合
            user = await prisma.user.findUnique({ where: { email: profile.email } })
          } else {
            // Google連携済みアカウントを検索
            const linkGoogle = await prisma.linkOAuth.getEnabled('google', token.sub)
            if (linkGoogle) {
              // Google連携済みアカウントあり
              user = linkGoogle.user
            } else {
              // Google連携済みアカウントなし
              // 連携対象の検索
              const linkUser = await prisma.user.getUserLinkOAuth('google', profile.email)
              if (linkUser && !linkUser.linkOAuth?.enabled) {
                // メールアドレスが一致、連携未登録の場合、Google連携情報(enabled=false)を登録
                const tmpLinkGoogle = await prisma.linkOAuth.registOneTime('google', linkUser.id, token.sub)
                // Google連携の認証に進む
                token.sub = `@google:${tmpLinkGoogle.onetimeId}`
                return token
              }
            }
          }
        }
      } else if (account?.provider === 'gitlab') {
        console.debug('@@param', param)
      } else {
        if (token.sub) {
          user = await prisma.user.findUnique({ where: { id: token.sub } })
        }
      }

      if (user) {
        // 最終サインイン
        if (param.trigger === 'signIn') {
          await prisma.lastSignIn.upsert({
            where: { id: user.id },
            create: { id: user.id, provider: account?.provider || '' },
            update: { provider: account?.provider || '' },
          })
        }

        token.sub = user.id
        token.name = user.name
        token.isAdmin = user.isAdmin
        token.locale = user.locale || undefined
        token.email = user.email
        console.debug('set token:', token.sub)
      } else {
        console.debug('user not found')
        token.sub = undefined
      }

      return token
    },
    async session(param) {
      const { token, session } = param
      if (token.sub) {
        if (token.sub.indexOf('@') === 0) {
          session.user = undefined
          session.oauth = 'test'
          return session
        }

        if (session.user) {
          session.user.id = token.sub
          session.user.name = token.name
          session.user.isAdmin = token.isAdmin
          session.user.locale = token.locale
          session.user.email = token.email
        }
        console.debug('set session:', JSON.stringify(session.user))
      } else {
        return undefined as unknown as Session
      }
      return session
    },
  },
}
if (isGoogleEnabled()) {
  authOptions.providers.push(GoogleProvider(getGoogleConfig()))
}
if (isGitLabEnabled()) {
  authOptions.providers.push(GitLabSelfProvider(getGitLabUrl(), getGitLabConfig()))
}
export { authOptions }

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}
