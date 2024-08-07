'use server'

import { isOAuthEnabled, isOAuthSimpleLogin } from '@/helpers/env'
import { errInvalidSession, errNotFound, errValidation } from '@/helpers/error'
import { getAllowedChangeEmail, getRequiredPasswordScore } from '@/helpers/key-value'
import { sendEmailConfirm } from '@/helpers/mail'
import { prisma } from '@/helpers/prisma'
import { scUpdateEmail, scUpdatePassword, zOAuthType, zReq, zString, zUUID } from '@/helpers/schema'
import { ActionResultType, validAction } from '@/helpers/server'
import { zxcvbn } from '@zxcvbn-ts/core'
import { randomUUID } from 'crypto'

/**
 * 設定取得
 */
export const getSettings = validAction('getSettings', {
  requireAuth: true,
  next: async () => {
    return {
      requiredPasswordScore: await getRequiredPasswordScore(),
      allowedChangeEmail: await getAllowedChangeEmail(),
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
      if (res.score < Number(await getRequiredPasswordScore())) {
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

/**
 * メールアドレスの存在確認
 */
export const existsEmail = validAction('existsEmail', {
  schema: zReq({ email: zString, excludeId: zUUID.optional() }),
  requireAuth: true,
  next: async ({ req: { email, excludeId } }) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (user) {
      return excludeId ? user.id !== excludeId : true
    }
    return false
  },
})

/**
 * メールアドレス変更(メール送信)
 */
export const changeEmail = validAction('changeEmail', {
  schema: scUpdateEmail,
  requireAuth: true,
  next: async ({ req, user }) => {
    if (req.id !== user.id) {
      throw errInvalidSession()
    }

    if (!(await getAllowedChangeEmail())) {
      throw errInvalidSession()
    }

    // パスワード確認メール送信
    const emailConfirm = await prisma.emailConfirm.upsert({
      where: { id: user.id },
      create: { id: user.id, onetimeId: randomUUID(), email: req.email },
      update: { onetimeId: randomUUID() },
    })
    await sendEmailConfirm({
      username: user.name,
      locale: user.locale,
      to: req.email,
      onetimeId: emailConfirm.onetimeId,
    })
  },
})
