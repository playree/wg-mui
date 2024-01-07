'use server'

import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'

export const initializeWgConf = async (data: InitializeWgConf) => {
  console.debug('initializeWgConf:')
  await prisma.wgConf.create({ data })
}
