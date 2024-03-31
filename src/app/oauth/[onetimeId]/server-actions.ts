'use server'

import { getSessionUser } from '@/config/auth-options'
import { withinMinutes } from '@/helpers/day'
import { OAuthType } from '@/helpers/env'
import { errInvalidSession } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

/**
 * OnetimeIdに紐づくユーザーの取得
 */
export const getOnetimeUser = validAction('getOnetimeUser', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const link = await prisma.linkOAuth.getOnetimeUser(onetimeId)
    if (link?.user) {
      let oauthName = ''
      switch (link.type) {
        case 'google':
          oauthName = 'Google'
          break
        case 'gitlab':
          oauthName = 'GitLab'
          break
      }

      // 有効期限15分
      return withinMinutes(link.updatedAt, 15)
        ? {
            ...link.user,
            oauth: {
              type: link.type,
              name: oauthName,
            },
          }
        : undefined
    }
    return undefined
  },
})

/**
 * OAuth連携有効化
 */
export const enableLinkOAuth = validAction('enableLinkOAuth', {
  schema: zReq({ onetimeId: zUUID }),
  next: async ({ req: { onetimeId } }) => {
    const user = await getSessionUser()
    if (!user) {
      throw errInvalidSession()
    }

    const link = await prisma.linkOAuth.getOnetimeUser(onetimeId)
    if (link?.id !== user.id) {
      throw errInvalidSession()
    }
    if (link?.enabled === true) {
      // 有効化済み
      return
    }
    if (link?.enabled !== false) {
      throw errInvalidSession()
    }

    // 有効期限15分
    if (!withinMinutes(link.updatedAt, 15)) {
      throw errInvalidSession()
    }

    await prisma.linkOAuth.enable(link.type as OAuthType, user.id)
  },
})
