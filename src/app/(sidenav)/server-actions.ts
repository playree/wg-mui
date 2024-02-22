'use server'

import { errCommunication, errNotFound } from '@/helpers/error'
import { scVoid } from '@/helpers/schema'
import { ActionResultType, validAuthAction } from '@/helpers/server'
import os from 'os'

import pkg from '../../../package.json'

/**
 * アプリ情報取得
 */
export const getAppInfo = validAuthAction(scVoid, async function getAppInfo() {
  const { version, buildno } = pkg
  return {
    version,
    buildno,
  }
})
export type AppInfo = ActionResultType<typeof getAppInfo>

/**
 * サーバー情報取得
 */
export const getServerInfo = validAuthAction(scVoid, async function getServerInfo() {
  return {
    memory: { total: os.totalmem(), free: os.freemem() },
    uptime: os.uptime(),
  }
})
export type ServerInfo = ActionResultType<typeof getServerInfo>

/**
 * Linode Transfer情報取得
 */
export const getLinodeTransferInfo = validAuthAction(scVoid, async function getLinodeTransferInfo() {
  if (process.env.LINODE_DUMMY) {
    // テスト用ダミー
    return JSON.parse(process.env.LINODE_DUMMY) as {
      used: number
      quota: number
      billable: number
      total: number
    }
  }

  if (process.env.LINODE_ID && process.env.LINODE_PERSONAL_ACCESS_TOKEN) {
    try {
      const res = await fetch(`https://api.linode.com/v4/linode/instances/${process.env.LINODE_ID}/transfer`, {
        headers: {
          Authorization: `Bearer ${process.env.LINODE_PERSONAL_ACCESS_TOKEN}`,
        },
        next: {
          revalidate: process.env.LINODE_ACCESS_INTERVAL ? Number(process.env.LINODE_ACCESS_INTERVAL) : 180,
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
  throw errNotFound()
})
export type LinodeTransferInfo = ActionResultType<typeof getLinodeTransferInfo>
