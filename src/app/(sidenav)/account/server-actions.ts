'use server'

import { errInvalidSession, errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword, scVoid } from '@/helpers/schema'
import { validateAuthAction } from '@/helpers/server'

/**
 * アカウント取得
 */
export const getAccount = validateAuthAction(scVoid, async function getAccount({ user }) {
  const account = await prisma.user.get(user.id)
  if (!account) {
    throw errNotFound()
  }
  return account
})

/**
 * パスワード変更
 */
export const updatePassword = validateAuthAction(scUpdatePassword, async function updatePassword({ req, user }) {
  if (req.id !== user.id) {
    throw errInvalidSession()
  }
  await prisma.user.updatePassword(req.id, req.password)
  return
})
