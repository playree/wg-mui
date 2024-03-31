'use server'

import { isOAuthEnabled, isOAuthSimpleLogin } from '@/helpers/env'
import { errInvalidSession, errNotFound, errValidation } from '@/helpers/error'
import { getRequiredPasswordScore } from '@/helpers/key-value'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword, zOAuthType, zReq } from '@/helpers/schema'
import { ActionResultType, validAction } from '@/helpers/server'
import { zxcvbn } from '@zxcvbn-ts/core'

/**
 * 設定取得
 */
export const getSettings = validAction('getSettings', {
  requireAuth: true,
  next: async () => {
    return {
      requiredPasswordScore: await getRequiredPasswordScore(),
    }
  },
})

/**
 * アカウント取得
 */
export const getAccount = validAction('getAccount', {
  requireAuth: true,
  next: async ({ user: { id } }) => {
    const user = await prisma.user.get(id)
    if (!user) {
      throw errNotFound()
    }

    const isLinkedGoogle = await prisma.linkOAuth.isEnabled('google', user.id)
    const isLinkedGitLab = await prisma.linkOAuth.isEnabled('gitlab', user.id)

    return {
      user,
      isLinkedGoogle: isOAuthEnabled('google') && !isOAuthSimpleLogin('google') ? isLinkedGoogle : undefined,
      isLinkedGitLab: isOAuthEnabled('gitlab') && !isOAuthSimpleLogin('gitlab') ? isLinkedGitLab : undefined,
    }
  },
})
export type Account = ActionResultType<typeof getAccount>

/**
 * パスワード変更
 */
export const updatePassword = validAction('updatePassword', {
  schema: scUpdatePassword,
  requireAuth: true,
  next: async ({ req, user }) => {
    if (req.id !== user.id) {
      throw errInvalidSession()
    }
    // パスワードスコアチェック
    if (req.password) {
      const res = zxcvbn(req.password)
      if (res.score < (await getRequiredPasswordScore())) {
        throw errValidation('password score')
      }
    }

    await prisma.user.updatePassword(req.id, req.password)
  },
})

/**
 * OAuth連携解除
 */
export const unlinkOAuth = validAction('unlinkOAuth', {
  schema: zReq({ type: zOAuthType }),
  requireAuth: true,
  next: async ({ user: { id }, req }) => {
    await prisma.linkOAuth.unlink(req.type, id)
  },
})
