'use server'

import { getSessionUser } from '@/config/auth-options'
import { errInvalidSession } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
import dayjs from 'dayjs'

/**
 * OnetimeIdに紐づくユーザーの取得
 */
export const getOnetimeGoogleUser = validAction('getOnetimeGoogleUser', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const linkGoogle = await prisma.linkGoogle.findUnique({
      where: { onetimeId },
      include: { user: { select: { id: true, email: true } } },
    })
    if (linkGoogle?.user) {
      const now = dayjs()
      const target = dayjs(linkGoogle.updatedAt)
      const diff = now.diff(target, 'minute')
      // 有効期限30分
      return diff < 30 ? linkGoogle.user : undefined
    }
    return undefined
  },
})

/**
 * Google連携有効化
 */
export const enableLinkGoogle = validAction('enableLinkGoogle', {
  next: async () => {
    const user = await getSessionUser()
    if (!user) {
      throw errInvalidSession()
    }
    const linkGoogle = await prisma.linkGoogle.findUnique({ where: { id: user.id } })
    if (linkGoogle?.enabled === true) {
      // 有効化済み
      return
    }
    if (linkGoogle?.enabled !== false) {
      throw errInvalidSession()
    }

    const now = dayjs()
    const target = dayjs(linkGoogle.updatedAt)
    const diff = now.diff(target, 'minute')
    // 有効期限30分
    if (diff >= 30) {
      throw errInvalidSession()
    }

    await prisma.linkGoogle.update({ where: { id: user.id }, data: { enabled: true } })
  },
})
