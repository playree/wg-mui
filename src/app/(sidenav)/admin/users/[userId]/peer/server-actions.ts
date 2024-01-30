'use server'

import { prisma } from '@/helpers/prisma'
import { CreatePeer } from '@/helpers/schema'
import { getWgMgr } from '@/helpers/wgmgr'
import { genPrivateKey } from '@/server-actions/cmd'

export const getUser = async (id: string) => {
  return prisma.user.get(id)
}

export const getPeerList = async (userId: string) => {
  return prisma.peer.getAllListByUser(userId, true)
}

export const getFreeAddressList = async () => {
  console.debug('getFreeAddressList:')
  const wgMgr = await getWgMgr()
  const freeAddressList = await wgMgr?.getFreeAddressList()
  return freeAddressList || ['']
}

export const getPrivateKey = async () => {
  return genPrivateKey()
}

export const createPeer = async (data: CreatePeer) => {
  console.debug('createPeer:in:', data)
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw new Error('WgMgr not initialized')
  }
  const peer = await wgMgr.createPeer(data)
  console.debug('createPeer:out:', peer)
  return peer
}

export const deletePeer = async (ip: string) => {
  console.debug('deletePeer:in:', ip)
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw new Error('WgMgr not initialized')
  }
  await wgMgr.deletePeer(ip)
  console.debug('deletePeer:out:')
}
