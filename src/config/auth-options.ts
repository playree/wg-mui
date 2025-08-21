import {
  OAUTH_TYPE_GITLAB,
  OAUTH_TYPE_GOOGLE,
  getEnvGitLabUrl,
  getEnvOAuthConfig,
  isEnvOAuthEnabled,
  isEnvOAuthSimpleLogin,
} from '@/helpers/env'
import { checkPassword } from '@/helpers/password'
import { prisma } from '@/helpers/prisma'
import { NextAuthOptions, Profile, Session } from 'next-auth'
import { getServerSession } from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { withinMinutes } from '@/helpers/day'
import { cookies } from 'next/headers'
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
      if (account?.provider === OAUTH_TYPE_GOOGLE || account?.provider === OAUTH_TYPE_GITLAB) {
        const provider = account.provider

        if (param.profile) {
          const profile: Profile & { email_verified?: boolean } = param.profile

          if (profile.email_verified === undefined) {
            // email_verifiedが存在しない場合はtrueとみなす
            profile.email_verified = true
          }

          if (token.sub && profile.email_verified && profile.email) {
            if (isEnvOAuthSimpleLogin(provider)) {
              // 簡易連携の場合
              user = await prisma.user.findUnique({ where: { email: profile.email } })
            } else {
              // OAuth連携済みアカウントを検索
              const linkOAuth = await prisma.linkOAuth.getEnabled(provider, token.sub)
              if (linkOAuth) {
                // OAuth連携済みアカウントあり
                user = linkOAuth.user
              } else {
                // OAuth連携済みアカウントなし

                // 任意連携の確認
                const cookieStore = await cookies()
                const linkot = cookieStore.get('linkot')
                if (linkot) {
                  // 任意連携
                  const onetimeId = linkot.value
                  cookieStore.delete('linkot')
                  const otLink = await prisma.linkOAuth.getOnetimeUser(onetimeId)
                  if (
                    otLink &&
                    !otLink.enabled &&
                    otLink.type === provider &&
                    otLink.sub === onetimeId &&
                    withinMinutes(otLink.updatedAt, 15)
                  ) {
                    // 連携を有効化
                    const linkOAuthOt = await prisma.linkOAuth.linkSub(onetimeId, otLink.type, token.sub)
                    if (linkOAuthOt) {
                      user = linkOAuthOt.user
                    }
                  }
                } else {
                  // 連携対象の検索
                  const linkUser = await prisma.user.getUserLinkOAuth(provider, profile.email)
                  if (linkUser && !linkUser.linkOAuth?.enabled) {
                    // メールアドレスが一致、連携未登録の場合、OAuth連携情報(enabled=false)を登録
                    const tmpLinkOAuth = await prisma.linkOAuth.registOneTime(provider, linkUser.id, token.sub)
                    // OAuth連携の認証に進む
                    token.oauth = {
                      type: provider,
                      onetime: tmpLinkOAuth.onetimeId,
                    }
                    return token
                  }
                }
              }
            }
          }
        }

        if (!user) {
          // OAuthログインNG
          token.sub = undefined
          token.isError = true
          return token
        }
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
        if (token.oauth) {
          session.user = undefined
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
        if (token.isError) {
          return { isError: true } as Session
        }
        return {} as Session
      }
      return session
    },
  },
}
if (isEnvOAuthEnabled('google')) {
  authOptions.providers.push(GoogleProvider(getEnvOAuthConfig('google')))
}
if (isEnvOAuthEnabled('gitlab')) {
  authOptions.providers.push(GitLabSelfProvider(getEnvGitLabUrl(), getEnvOAuthConfig('gitlab')))
}
export { authOptions }

export const getSessionUser = async () => {
  const session = await getServerSession(authOptions)
  return session?.user
}
