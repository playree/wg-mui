'use server'

import { errInvalidSession, errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

/**
 * アカウント取得
 */
export const getAccount = validAction('getAccount', {
  requireAuth: true,
  next: async ({ user }) => {
    const account = await prisma.user.get(user.id)
    if (!account) {
      throw errNotFound()
    }
    return account
  },
})

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
    return
  },
})
