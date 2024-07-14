'use server'

import { withinMinutes } from '@/helpers/day'
import { prisma } from '@/helpers/prisma'
import { zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

const getOnetime = async (onetimeId: string) => {
  const onetime = await prisma.emailConfirm.findUnique({ where: { onetimeId } })
  if (!onetime) {
    return undefined
  }

  // 有効期限2日
  return withinMinutes(onetime.updatedAt, 48 * 60) ? onetime : undefined
}

/**
 * メアド確認用OnetimeIdの有効性チェック
 */
export const isEnabledOnetimeId = validAction('isEnabledOnetimeId', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const onetime = await getOnetime(onetimeId)
    return onetime?.email
  },
})

/**
 * メアド変更
 */
export const changeEmail = validAction('changeEmail', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const onetime = await getOnetime(onetimeId)
    if (!onetime) {
      return undefined
    }

    await prisma.emailConfirm.delete({ where: { id: onetime.id } })
    await prisma.user.updateEmail(onetime.id, onetime.email)
    return onetime.email
  },
})
