'use server'

import { getSessionUser } from '@/config/auth-options'
import { errInvalidSession, errNotFound, errSystemError } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { getWgMgr } from '@/helpers/wgmgr'

export const getUserPeerList = async () => {
  // ログインユーザーを確認
  const user = await getSessionUser()
  if (!user) {
    throw errInvalidSession()
  }

  const peerList = await prisma.peer.getAllListByUser(user.id)
  console.debug('getUserPeerList:', user.id, peerList.length)
  return peerList
}

export const getUserPeerConf = async (ip: string) => {
  // ログインユーザーを確認
  const user = await getSessionUser()
  if (!user) {
    throw errInvalidSession()
  }

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
}
