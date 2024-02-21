'use server'

import os from 'os'

import pkg from '../../../package.json'

export const getAppInfo = async () => {
  console.debug('getAppInfo:')
  const { version, buildno } = pkg
  return {
    version,
    buildno,
  }
}
export type AppInfo = Awaited<ReturnType<typeof getAppInfo>>

export const getServerInfo = async () => {
  console.debug('getServerInfo:')

  return {
    memory: { total: os.totalmem(), free: os.freemem() },
    uptime: os.uptime(),
  }
}
export type ServerInfo = Awaited<ReturnType<typeof getServerInfo>>

export const getLinodeTransferInfo = async () => {
  if (process.env.LINODE_DUMMY) {
    // テスト用ダミー
    return JSON.parse(process.env.LINODE_DUMMY)
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
      //
    }
  }
  return undefined
}
export type LinodeTransferInfo = Awaited<ReturnType<typeof getLinodeTransferInfo>>
