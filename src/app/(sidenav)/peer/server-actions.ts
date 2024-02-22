'use server'

import { errNotFound, errSystemError } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { scVoid, zIp, zReq } from '@/helpers/schema'
import { validAuthAction } from '@/helpers/server'
import { getWgMgr, refWgMgr } from '@/helpers/wgmgr'

/**
 * ログインユーザーのピアリスト取得
 */
export const getUserPeerList = validAuthAction(scVoid, async function getUserPeerList({ user }) {
  const wgMgr = await refWgMgr()

  const peerList = await prisma.peer.getAllListByUser(user.id)
  const peerStatus = await wgMgr.getPeerStatus()
  return peerList.map((peer) => ({ ...peer, status: peerStatus ? peerStatus[peer.ip] : undefined }))
})

/**
 * 対象IPのピア設定取得
 */
export const getUserPeerConf = validAuthAction(
  zReq({ ip: zIp }),
  async function getUserPeerConf({ req: { ip }, user }) {
    // IPとユーザーでピア検索
    const peer = await prisma.peer.findUnique({ where: { ip, userId: user.id } })
    if (!peer) {
      throw errNotFound()
    }

    const wgMgr = await getWgMgr()
    if (!wgMgr) {
      throw errSystemError()
    }

    return wgMgr.getPeerConf(peer)
  },
)
