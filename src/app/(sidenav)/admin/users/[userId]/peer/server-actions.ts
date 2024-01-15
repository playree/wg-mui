'use server'

import { prisma } from '@/helpers/prisma'
import { CreatePeer } from '@/helpers/schema'
import { getWgMgr } from '@/helpers/wgmgr'
import { genPrivateKey, genPublicKey } from '@/server-actions/cmd'

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

export const createPeer = async (data: CreatePeer) => {
  console.debug('createPeer:in:', data)
  const publicKey = await genPublicKey(data.privateKey)
  if (!publicKey) {
    throw new Error('Failed to generate public key')
  }
  prisma.peer.create({ data: { ...data, publicKey } })
}
