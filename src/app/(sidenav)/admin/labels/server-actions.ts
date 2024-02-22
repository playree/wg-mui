'use server'

import { prisma } from '@/helpers/prisma'
import { scCreateLabel, scUpdateLabel, zAllOrCount, zReq, zString, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'

/**
 * ラベルリスト取得(管理者権限)
 */
export const getLabelList = validAction({
  schema: zReq({ withUser: zAllOrCount.optional() }),
  requireAuth: true,
  requireAdmin: true,
  next: async function getLabelList({ req }) {
    return prisma.label.getAllList(req.withUser)
  },
})

/**
 * ラベル作成(管理者権限)
 */
export const createLabel = validAction({
  schema: scCreateLabel,
  requireAuth: true,
  requireAdmin: true,
  next: async function createLabel({ req }) {
    return prisma.label.create({ data: req })
  },
})

/**
 * ラベル更新(管理者権限)
 */
export const updateLabel = validAction({
  schema: scUpdateLabel,
  requireAuth: true,
  requireAdmin: true,
  next: async function updateLabel({ req }) {
    const { id, ...data } = req
    return prisma.label.update({ where: { id }, data })
  },
})

/**
 * ラベル削除(管理者権限)
 */
export const deleteLabel = validAction({
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async function deleteLabel({ req: { id } }) {
    return prisma.label.delete({ where: { id } })
  },
})

/**
 * ラベル名の存在確認(管理者権限)
 */
export const existsLabelName = validAction({
  schema: zReq({ name: zString, excludeId: zUUID.optional() }),
  requireAuth: true,
  requireAdmin: true,
  next: async function existsLabelName({ req: { name, excludeId } }) {
    const label = await prisma.label.findUnique({ where: { name } })
    if (label) {
      return excludeId ? label.id !== excludeId : true
    }
    return false
  },
})
