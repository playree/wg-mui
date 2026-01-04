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
import type { NextAuthConfig } from 'next-auth'
import { Profile, Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

import { matchCondition } from '@/components/nextekit/auth/utils'
import { withinMinutes } from '@/helpers/day'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { authProps } from './auth-props'
import { GitLabSelfProvider } from './gitlab-self-provider'

const providers = []
if (isEnvOAuthEnabled('google')) {
  providers.push(GoogleProvider(getEnvOAuthConfig('google')))
}
if (isEnvOAuthEnabled('gitlab')) {
  providers.push(GitLabSelfProvider(getEnvGitLabUrl(), getEnvOAuthConfig('gitlab')))
}

const requireSignIn = (origin: string, callbackUrl: string) => {
  const url = new URL('/auth/signin', origin)
  url.searchParams.append('callbackUrl', callbackUrl)
  return Response.redirect(url)
}

export const authConfig = {
  logger: {
    error: (err) => {
      if (err.name === 'CredentialsSignin') {
        return
      }
      console.error(err)
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        console.debug('authorize:', credentials)
        const name = (credentials?.username as string) || ''
        const password = (credentials?.password as string) || ''

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
    ...providers,
  ],
  jwt: {
    maxAge: 86400,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      console.debug('callbacks:signIn:', { provider: account?.provider, id: user.id })
      return true
    },
    jwt: async (param) => {
      console.debug('callbacks:jwt:', param)

      const { token, account } = param

      let user
      if (account?.provider === OAUTH_TYPE_GOOGLE || account?.provider === OAUTH_TYPE_GITLAB) {
        const provider = account.provider

        if (param.profile) {
          const profile: Profile = param.profile

          if (profile.email_verified === undefined) {
            // email_verifiedが存在しない場合はtrueとみなす
            profile.email_verified = true
          }

          if (profile.sub && profile.email_verified && profile.email) {
            if (isEnvOAuthSimpleLogin(provider)) {
              // 簡易連携の場合
              user = await prisma.user.findUnique({ where: { email: profile.email } })
            } else {
              // OAuth連携済みアカウントを検索
              const linkOAuth = await prisma.linkOAuth.getEnabled(provider, profile.sub)
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
                    const linkOAuthOt = await prisma.linkOAuth.linkSub(onetimeId, otLink.type, profile.sub)
                    if (linkOAuthOt) {
                      user = linkOAuthOt.user
                    }
                  }
                } else {
                  // 連携対象の検索
                  const linkUser = await prisma.user.getUserLinkOAuth(provider, profile.email)
                  if (linkUser && !linkUser.linkOAuth?.enabled) {
                    // メールアドレスが一致、連携未登録の場合、OAuth連携情報(enabled=false)を登録
                    const tmpLinkOAuth = await prisma.linkOAuth.registOneTime(provider, linkUser.id, profile.sub)
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
    session: async (param) => {
      console.debug('callbacks:session:', param)

      const { token, session } = param
      if (token.sub) {
        if (token.oauth) {
          console.debug('callbacks:session:oauth:')
          session.user = { id: '', name: '', isAdmin: false, email: '', emailVerified: null, oauth: token.oauth }
          return session
        }

        if (session.user) {
          session.user.id = token.sub
          session.user.name = token.name
          session.user.isAdmin = token.isAdmin
          session.user.locale = token.locale
          session.user.email = token.email || ''
        }
        console.debug('set session:', JSON.stringify(session.user))
      } else {
        console.debug('callbacks:session:error:', token.isError)
        if (token.isError) {
          return { isError: true } as Session
        }
        return {} as Session
      }
      return session
    },
    authorized: ({ request, auth }) => {
      console.debug('callbacks:authorized:', request.nextUrl, auth)

      if (auth?.user?.oauth?.onetime) {
        // 連携シーケンスの場合は一旦通過
        console.debug('callbacks:authorized:oauth:')
        return true
      }

      // 認証対象外
      if (!matchCondition(request.nextUrl.pathname, authProps.targetAuth)) {
        return true
      }

      if (auth?.user?.id) {
        // 認証済み

        // 管理者権限の確認
        if (matchCondition(request.nextUrl.pathname, authProps.targetAdmin)) {
          console.debug('callbacks:authorized:admin:', auth?.user?.isAdmin)
          if (auth?.user?.isAdmin) {
            return true
          }
          return NextResponse.json(null, { status: 403 })
        }

        return true
      }
      return requireSignIn(request.nextUrl.origin, request.nextUrl.href)
    },
  },
} satisfies NextAuthConfig
