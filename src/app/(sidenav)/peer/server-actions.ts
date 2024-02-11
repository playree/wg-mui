'use server'

import { getSessionUser } from '@/config/auth-options'
import { errInvalidSession } from '@/helpers/error'
import { prisma } from '@/helpers/prisma'

export const getUserPeerList = async () => {
  const user = await getSessionUser()
  if (!user) {
    throw errInvalidSession()
  }

  const peerList = await prisma.peer.getAllListByUser(user.id)
  console.debug('getUserPeerList:', user.id, peerList.length)
  return peerList
}
