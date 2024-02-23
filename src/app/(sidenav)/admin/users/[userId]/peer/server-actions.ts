'use server'

import { prisma } from '@/helpers/prisma'
import { scCreatePeer, scUpdatePeer, zIp, zReq, zUUID } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
import { refWgMgr } from '@/helpers/wgmgr'
import { genPrivateKey } from '@/server-actions/cmd'

/**
 * ユーザー取得(管理者権限)
 */
export const getUser = validAction({
  schema: zReq({ id: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async function getUser({ req: { id } }) {
    return prisma.user.get(id)
  },
})

/**
 * 対象ユーザのピアリスト取得(管理者権限)
 */
export const getPeerList = validAction({
  schema: zReq({ userId: zUUID }),
  requireAuth: true,
  requireAdmin: true,
  next: async function getPeerList({ req: { userId } }) {
    return prisma.peer.getAllListByUser(userId, true)
  },
})

/**
 * 空きIPリスト取得(管理者権限)
 */
export const getFreeAddressList = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function getFreeAddressList() {
    const wgMgr = await refWgMgr()
    const freeAddressList = await wgMgr.getFreeAddressList()
    return freeAddressList || ['']
  },
})

/**
 * 秘密鍵取得(管理者権限)
 */
export const getPrivateKey = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function getPrivateKey() {
    return genPrivateKey()
  },
})

/**
 * ピア作成(管理者権限)
 */
export const createPeer = validAction({
  schema: scCreatePeer,
  requireAuth: true,
  requireAdmin: true,
  next: async function createPeer({ req }) {
    const wgMgr = await refWgMgr()
    return wgMgr.createPeer(req)
  },
})

/**
 * ピア更新(管理者権限)
 */
export const updatePeer = validAction({
  schema: scUpdatePeer,
  requireAuth: true,
  requireAdmin: true,
  next: async function updatePeer({ req }) {
    const { ip, ...data } = req
    return prisma.peer.update({ where: { ip }, data })
  },
})

/**
 * ピア削除(管理者権限)
 */
export const deletePeer = validAction({
  schema: zReq({ ip: zIp }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { ip } }) => {
    const wgMgr = await refWgMgr()
    await wgMgr.deletePeer(ip)
  },
})
