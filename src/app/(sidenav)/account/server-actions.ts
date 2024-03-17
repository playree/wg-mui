'use server'

import { isGoogleEnabled, isGoogleSimpleLogin } from '@/helpers/env'
import { errInvalidSession, errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword } from '@/helpers/schema'
import { ActionResultType, validAction } from '@/helpers/server'

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

    const linkGoogle = await prisma.linkGoogle.findUnique({ where: { id: user.id } })

    return { user, isLinkedGoogle: isGoogleEnabled() && !isGoogleSimpleLogin() ? !!linkGoogle?.enabled : undefined }
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
    await prisma.user.updatePassword(req.id, req.password)
  },
})

/**
 * Google連携解除
 */
export const unlinkGoogle = validAction('unlinkGoogle', {
  requireAuth: true,
  next: async ({ user: { id } }) => {
    await prisma.linkGoogle.delete({ where: { id } })
  },
})
