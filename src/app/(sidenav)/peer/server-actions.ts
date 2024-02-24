'use server'

import { errNotFound } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { zIp, zReq } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
import { refWgMgr } from '@/helpers/wgmgr'

/**
 * ログインユーザーのピアリスト取得
 */
export const getUserPeerList = validAction('getUserPeerList', {
  requireAuth: true,
  next: async ({ user }) => {
    const wgMgr = await refWgMgr()
    const peerList = await prisma.peer.getAllListByUser(user.id)
    const peerStatus = await wgMgr.getPeerStatus()
    return peerList.map((peer) => ({ ...peer, status: peerStatus ? peerStatus[peer.ip] : undefined }))
  },
})

/**
 * 対象IPのピア設定取得
 */
export const getUserPeerConf = validAction('getUserPeerConf', {
  schema: zReq({ ip: zIp }),
  requireAuth: true,
  next: async ({ req: { ip }, user }) => {
    // IPとユーザーでピア検索
    const peer = await prisma.peer.findUnique({ where: { ip, userId: user.id } })
    if (!peer) {
      throw errNotFound()
    }
    const wgMgr = await refWgMgr()
    return wgMgr.getPeerConf(peer)
  },
})
