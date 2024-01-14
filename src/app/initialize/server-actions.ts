'use server'

import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'
import { genPublicKey } from '@/server-actions/cmd'

export const initializeWgConf = async (conf: InitializeWgConf) => {
  console.debug('initializeWgConf:')
  const publicKey = await genPublicKey(conf.privateKey)
  if (!publicKey) {
    throw new Error('Failed to generate public key')
  }
  await prisma.wgConf.create({ data: { ...conf, publicKey } })
}
