'use server'

import { getWgMgr } from '@/helpers/wgmgr'
import { getIpForward } from '@/server-actions/cmd'

export const getSystemInfo = async () => {
  console.debug('getSystemInfomation:')
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw new Error('WgMgr not initialized')
  }

  const wgVersion = await wgMgr.getWgVersion()
  const ipForward = await getIpForward()

  return {
    wgVersion,
    isWgStarted: wgVersion ? await wgMgr.isWgStarted() : false,
    ipForward,
  }
}
export type SystemInfo = Awaited<ReturnType<typeof getSystemInfo>>

export const startWg = async () => {
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw new Error('WgMgr not initialized')
  }

  console.debug('startWg:')
  return wgMgr.startWg()
}
