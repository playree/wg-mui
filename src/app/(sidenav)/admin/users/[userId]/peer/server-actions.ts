'use server'

import { prisma } from '@/helpers/prisma'
import { getWgMgr } from '@/helpers/wgmgr'
import { genPrivateKey } from '@/server-actions/cmd'

export const getUser = async (id: string) => {
  return prisma.user.get(id)
}

export const getPeerList = async (userId: string) => {
  return prisma.peer.getAllListByUser(userId, true)
}

export const getFreeAddressList = async () => {
  const wgMgr = await getWgMgr()
  const freeAddressList = await wgMgr?.getFreeAddressList()
  return freeAddressList || ['']
}

export const getPrivateKey = async () => {
  return genPrivateKey()
}
