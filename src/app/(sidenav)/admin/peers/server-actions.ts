'use server'

import { errSystemError } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'
import { convTransfer, getWgMgr } from '@/helpers/wgmgr'

export const getPeerAllList = async () => {
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw errSystemError()
  }

  const peerList = await prisma.peer.getAllList()
  const peerStatus = await wgMgr.getPeerStatus()

  return peerList.map((peer) => {
    const status = peerStatus ? peerStatus[peer.ip] : undefined
    return {
      ip: peer.ip,
      remarks: peer.remarks,
      updatedAt: peer.updatedAt,
      ...convTransfer(status?.transfer),
    }
  })
}

export const reloadPeerStatus = async () => {
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw errSystemError()
  }

  // ピアステータスの強制リロード
  await wgMgr.getPeerStatus(true)
}
