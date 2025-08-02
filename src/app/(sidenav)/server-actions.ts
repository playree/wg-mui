'use server'

import { errCommunication } from '@/helpers/error'
import { ActionResultType, validAction } from '@/helpers/server'
import { getLocaleValue } from '@/locale/server'
import os from 'os'

import {
  getEnvDebugLinodeDummy,
  getEnvLinodeAccessInterval,
  getEnvLinodeId,
  getEnvLinodePersonalAccessToken,
} from '@/helpers/env'
import pkg from '../../../package.json'

/**
 * アプリ情報取得
 */
export const getAppInfo = validAction('getAppInfo', {
  requireAuth: true,
  next: async () => {
    const { version, buildno } = pkg
    return {
      version,
      buildno,
    }
  },
})
export type AppInfo = ActionResultType<typeof getAppInfo>

/**
 * サーバー情報取得
 */
export const getServerInfo = validAction('getServerInfo', {
  requireAuth: true,
  next: async () => {
    return {
      memory: { total: os.totalmem(), free: os.freemem() },
      uptime: os.uptime(),
    }
  },
})
export type ServerInfo = ActionResultType<typeof getServerInfo>

/**
 * トップページ通知取得
 */
export const getTopPageNotice = validAction('getTopPageNotice', {
  requireAuth: true,
  next: async () => {
    const topPageNotice = await getLocaleValue('top_page_notice')
    return {
      topPageNotice,
    }
  },
})
export type TopPageNotice = ActionResultType<typeof getTopPageNotice>

/**
 * Linode Transfer情報取得
 */
export const getLinodeTransferInfo = validAction('getLinodeTransferInfo', {
  requireAuth: true,
  next: async () => {
    const dummy = getEnvDebugLinodeDummy()
    if (dummy) {
      // テスト用ダミー
      return JSON.parse(dummy) as {
        used: number
        quota: number
        billable: number
        total: number
      }
    }

    const id = getEnvLinodeId()
    const token = getEnvLinodePersonalAccessToken()
    const interval = getEnvLinodeAccessInterval()
    if (id && token) {
      try {
        const res = await fetch(`https://api.linode.com/v4/linode/instances/${id}/transfer`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          next: {
            revalidate: interval ? Number(interval) : 180,
          },
        })
        const info: {
          used: number
          quota: number
          billable: number
        } = await res.json()
        return {
          ...info,
          total: info.quota * Math.pow(1024, 3),
        }
      } catch {
        throw errCommunication('Linode Transfer')
      }
    }
    return null
  },
})
export type LinodeTransferInfo = ActionResultType<typeof getLinodeTransferInfo>
