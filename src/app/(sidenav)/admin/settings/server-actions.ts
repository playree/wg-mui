'use server'

import { ActionResultType, validAction } from '@/helpers/server'
import { refWgMgr } from '@/helpers/wgmgr'
import { getIpForward } from '@/server-actions/cmd'

/**
 * システム情報取得(管理者権限)
 */
export const getSystemInfo = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function getSystemInfo() {
    const wgMgr = await refWgMgr()
    const wgVersion = await wgMgr.getWgVersion()
    const ipForward = await getIpForward()
    return {
      wgVersion,
      isWgStarted: wgVersion ? await wgMgr.isWgStarted() : false,
      isWgAutoStartEnabled: wgVersion ? await wgMgr.isWgAutoStartEnabled() : false,
      ipForward,
    }
  },
})
export type SystemInfo = ActionResultType<typeof getSystemInfo>

/**
 * WireGurd起動(管理者権限)
 */
export const startWg = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function startWg() {
    const wgMgr = await refWgMgr()
    return wgMgr.startWg()
  },
})

/**
 * WireGurd停止(管理者権限)
 */
export const stopWg = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function stopWg() {
    const wgMgr = await refWgMgr()
    return wgMgr.stopWg()
  },
})

/**
 * WireGurd自動起動ON(管理者権限)
 */
export const ebableWgAutoStart = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function ebableWgAutoStart() {
    const wgMgr = await refWgMgr()
    return wgMgr.ebableWgAutoStart()
  },
})

/**
 * WireGurd自動起動OFF(管理者権限)
 */
export const disableWgAutoStart = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function disableWgAutoStart() {
    const wgMgr = await refWgMgr()
    return wgMgr.disableWgAutoStart()
  },
})

/**
 * ピアステータス取得(管理者権限)
 */
export const getPeerStatus = validAction({
  requireAuth: true,
  requireAdmin: true,
  next: async function getPeerStatus() {
    const wgMgr = await refWgMgr()
    return wgMgr.getPeerStatus()
  },
})
