'use server'

import { prisma } from '@/helpers/prisma'
import { validAction } from '@/helpers/server'
import { convTransfer, refWgMgr } from '@/helpers/wgmgr'

/**
 * ピア一覧取得(管理者権限)
 */
export const getPeerAllList = validAction('getPeerAllList', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()

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
  },
})
