'use server'

import { genPublicKey } from '@/helpers/cmd'
import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'

export const initializeWgConf = async (conf: InitializeWgConf) => {
  console.debug('initializeWgConf:')
  const publicKey = await genPublicKey(conf.privateKey)
  if (!publicKey) {
    throw new Error('Failed to generate public key')
  }
  await prisma.wgConf.create({ data: { ...conf, publicKey } })
}
