'use server'

import { withinMinutes } from '@/helpers/day'
import { errNotFound } from '@/helpers/error'
import { getRequiredPasswordScore } from '@/helpers/key-value'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword, zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

/**
 * 設定取得
 */
export const getSettings = validAction('getSettings', {
  next: async () => {
    return {
      requiredPasswordScore: await getRequiredPasswordScore(),
    }
  },
})

const getOnetime = async (onetimeId: string) => {
  const onetime = await prisma.passwordReset.findUnique({ where: { onetimeId } })
  if (!onetime) {
    return undefined
  }

  // 有効期限2日
  return withinMinutes(onetime.updatedAt, 48 * 60) ? onetime : undefined
}

/**
 * パスワード初期設定用OnetimeIdの有効性チェック
 */
export const isEnabledOnetimeId = validAction('isEnabledOnetimeId', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const onetime = await getOnetime(onetimeId)
    return !!onetime
  },
})

/**
 * パスワードリセット
 */
export const resetPassword = validAction('resetPassword', {
  schema: scUpdatePassword,
  next: async ({ req: { id, password } }) => {
    const onetime = await getOnetime(id)
    if (!onetime) {
      throw errNotFound()
    }

    await prisma.passwordReset.delete({ where: { id: onetime.id } })
    await prisma.user.updatePassword(onetime.id, password)
  },
})
