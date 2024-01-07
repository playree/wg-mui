'use server'

import { WgConf } from '@prisma/client'

import { prisma } from './prisma'

let wgConf: WgConf | undefined

export const getWgConf = async () => {
  if (wgConf) {
    return wgConf
  }
  wgConf = (await prisma.wgConf.findUnique({ where: { id: 'main' } })) || undefined
  console.debug('Load WgConf:', wgConf)
  return wgConf
}
