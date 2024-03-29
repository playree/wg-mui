'use server'

import { getSessionUser } from '@/config/auth-options'
import { withinMinutes } from '@/helpers/day'
import { errInvalidSession } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

/**
 * OnetimeIdに紐づくユーザーの取得
 */
export const getOnetimeGoogleUser = validAction('getOnetimeGoogleUser', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const link = await prisma.linkOAuth.getOnetimeUser(onetimeId)
    if (link?.user) {
      // 有効期限15分
      return withinMinutes(link.updatedAt, 15) ? link.user : undefined
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
    const linkGoogle = await prisma.linkOAuth.get('google', user.id)
    if (linkGoogle?.enabled === true) {
      // 有効化済み
      return
    }
    if (linkGoogle?.enabled !== false) {
      throw errInvalidSession()
    }

    // 有効期限15分
    if (!withinMinutes(linkGoogle.updatedAt, 15)) {
      throw errInvalidSession()
    }

    await prisma.linkOAuth.enable('google', user.id)
  },
})
