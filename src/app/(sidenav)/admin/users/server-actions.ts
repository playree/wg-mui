'use server'

import { prisma } from '@/helpers/prisma'
import { scCreateUser, scUpdateUser, zBoolean, zReq, zString, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
import { refWgMgr } from '@/helpers/wgmgr'

/**
 * ユーザーリスト取得(管理者権限)
 */
export const getUserList = validAction('getUserList', {
  schema: zReq({
    withLabel: zBoolean.optional(),
    withPeer: zBoolean.optional(),
  }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    return prisma.user.getAllList(req)
  },
})

/**
 * ユーザー作成(管理者権限)
 */
export const createUser = validAction('createUser', {
  schema: scCreateUser,
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    return prisma.user.createUser(req)
  },
})

/**
 * ユーザー更新(管理者権限)
 */
export const updateUser = validAction('updateUser', {
  schema: scUpdateUser,
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    return prisma.user.updateUser(req)
  },
})

/**
 * ユーザー削除(管理者権限)
 */
export const deleteUser = validAction('deleteUser', {
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { id } }) => {
    // ピアの削除
    const wgMgr = await refWgMgr()
    await wgMgr.deletePeerByUser(id)
    // ユーザーの削除
    await prisma.user.delete({ where: { id } })
    return
  },
})

/**
 * ユーザー名の存在確認(管理者権限)
 */
export const existsUserName = validAction('existsUserName', {
  schema: zReq({ name: zString, excludeId: zUUID.optional() }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { name, excludeId } }) => {
    const user = await prisma.user.findUnique({ where: { name } })
    if (user) {
      return excludeId ? user.id !== excludeId : true
    }
    return false
  },
})
