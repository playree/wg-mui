import {
  OAUTH_TYPE_GITLAB,
  OAUTH_TYPE_GOOGLE,
  getGitLabUrl,
  getOAuthConfig,
  isOAuthEnabled,
  isOAuthSimpleLogin,
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
      if (account?.provider === OAUTH_TYPE_GOOGLE) {
        const provider = account.provider
        const profile: (Profile & { email_verified?: boolean }) | undefined = param.profile
        if (token.sub && profile?.email_verified && profile?.email) {
          if (isOAuthSimpleLogin(provider)) {
            // 簡易連携の場合
            user = await prisma.user.findUnique({ where: { email: profile.email } })
          } else {
            // Google連携済みアカウントを検索
            const linkGoogle = await prisma.linkOAuth.getEnabled(provider, token.sub)
            if (linkGoogle) {
              // Google連携済みアカウントあり
              user = linkGoogle.user
            } else {
              // Google連携済みアカウントなし
              // 連携対象の検索
              const linkUser = await prisma.user.getUserLinkOAuth(provider, profile.email)
              if (linkUser && !linkUser.linkOAuth?.enabled) {
                // メールアドレスが一致、連携未登録の場合、Google連携情報(enabled=false)を登録
                const tmpLinkGoogle = await prisma.linkOAuth.registOneTime(provider, linkUser.id, token.sub)
                // Google連携の認証に進む
                token.sub = `@${provider}:${tmpLinkGoogle.onetimeId}`
                return token
              }
            }
          }
        }
      } else if (account?.provider === OAUTH_TYPE_GITLAB) {
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
if (isOAuthEnabled('google')) {
  authOptions.providers.push(GoogleProvider(getOAuthConfig('google')))
}
if (isOAuthEnabled('gitlab')) {
  authOptions.providers.push(GitLabSelfProvider(getGitLabUrl(), getOAuthConfig('gitlab')))
}
export { authOptions }

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}
