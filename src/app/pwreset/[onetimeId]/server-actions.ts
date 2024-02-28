'use server'

import { errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { scUpdatePassword, zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
import dayjs from 'dayjs'

const getOnetime = async (onetimeId: string) => {
  const onetime = await prisma.passwordReset.findUnique({ where: { onetimeId } })
  if (!onetime) {
    return undefined
  }

  const now = dayjs()
  const target = dayjs(onetime.updatedAt)
  const diff = now.diff(target, 'minute')
  console.debug('isEnabledOnetimeId:diff:', diff)
  return diff < 48 * 60 ? onetime : undefined
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
