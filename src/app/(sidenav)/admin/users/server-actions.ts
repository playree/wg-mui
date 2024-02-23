'use server'

import { prisma } from '@/helpers/prisma'
import { scCreateUser, scUpdateUser, zBoolean, zReq, zString, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

/**
 * ユーザーリスト取得(管理者権限)
 */
export const getUserList = validAction({
  schema: zReq({
    withLabel: zBoolean.optional(),
    withPeer: zBoolean.optional(),
  }),
  requireAuth: true,
  requireAdmin: true,
  next: async function getUserList({ req }) {
    return prisma.user.getAllList(req)
  },
})

/**
 * ユーザー作成(管理者権限)
 */
export const createUser = validAction({
  schema: scCreateUser,
  requireAuth: true,
  requireAdmin: true,
  next: async function createUser({ req }) {
    return prisma.user.createUser(req)
  },
})

/**
 * ユーザー更新(管理者権限)
 */
export const updateUser = validAction({
  schema: scUpdateUser,
  requireAuth: true,
  requireAdmin: true,
  next: async function updateUser({ req }) {
    return prisma.user.updateUser(req)
  },
})

/**
 * ユーザー削除(管理者権限)
 */
export const deleteUser = validAction({
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async function deleteUser({ req: { id } }) {
    await prisma.user.delete({ where: { id } })
    return
  },
})

/**
 * ユーザー名の存在確認(管理者権限)
 */
export const existsUserName = validAction({
  schema: zReq({ name: zString, excludeId: zUUID.optional() }),
  requireAuth: true,
  requireAdmin: true,
  next: async function existsUserName({ req: { name, excludeId } }) {
    console.debug('existsUser:in:', name)
    const user = await prisma.user.findUnique({ where: { name } })
    if (user) {
      return excludeId ? user.id !== excludeId : true
    }
    return false
  },
})
