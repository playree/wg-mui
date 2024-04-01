'use server'

import { isOAuthEnabled } from '@/helpers/env'
import { prisma } from '@/helpers/prisma'
import { getLocaleFormSchema, scWgConfForClients, scWgConfPostScript, zInterfaceName, zReq } from '@/helpers/schema'
import { ActionResultType, validAction } from '@/helpers/server'
import { refWgMgr } from '@/helpers/wgmgr'
import { getLocaleValue, setLocaleValue } from '@/locale/server'
import { getDefaultNetworkInterface, getIpForward } from '@/server-actions/cmd'

/**
 * システム情報取得(管理者権限)
 */
export const getSystemInfo = validAction('getSystemInfo', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    const wgVersion = await wgMgr.getWgVersion()
    const ipForward = await getIpForward()
    const sendMail = {
      enabled: false,
      from: process.env.MAIL_FROM || '',
      type: '',
    }
    switch (process.env.MAIL_SEND) {
      case 'sendgrid':
        if (process.env.SENDGRID_API_KEY) {
          sendMail.enabled = true
          sendMail.type = 'SendGrid'
        }
        break
    }
    return {
      wgVersion,
      safeWgConf: {
        interfaceName: wgMgr.conf.interfaceName,
        address: wgMgr.conf.address,
        listenPort: wgMgr.conf.listenPort,
        postUp: wgMgr.conf.postUp,
        postDown: wgMgr.conf.postDown,
        endPoint: wgMgr.conf.endPoint,
        dns: wgMgr.conf.dns,
        defaultAllowedIPs: wgMgr.conf.defaultAllowedIPs,
        defaultKeepalive: wgMgr.conf.defaultKeepalive,
      },
      isWgStarted: wgVersion ? await wgMgr.isWgStarted() : false,
      isWgAutoStartEnabled: wgVersion ? await wgMgr.isWgAutoStartEnabled() : false,
      ipForward,
      isGoogleEnabled: isOAuthEnabled('google'),
      isGitLabEnabled: isOAuthEnabled('gitlab'),
      sendMail,
    }
  },
})
export type SystemInfo = ActionResultType<typeof getSystemInfo>

/**
 * WireGurd起動(管理者権限)
 */
export const startWg = validAction('startWg', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    return wgMgr.startWg()
  },
})

/**
 * WireGurd停止(管理者権限)
 */
export const stopWg = validAction('stopWg', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    return wgMgr.stopWg()
  },
})

/**
 * WireGurd自動起動ON(管理者権限)
 */
export const ebableWgAutoStart = validAction('ebableWgAutoStart', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    return wgMgr.ebableWgAutoStart()
  },
})

/**
 * WireGurd自動起動OFF(管理者権限)
 */
export const disableWgAutoStart = validAction('disableWgAutoStart', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    return wgMgr.disableWgAutoStart()
  },
})

/**
 * ピアステータス取得(管理者権限)
 */
export const getPeerStatus = validAction('getPeerStatus', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    return wgMgr.getPeerStatus()
  },
})

/**
 * ピアの整理
 */
export const organizePeers = validAction('organizePeers', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const wgMgr = await refWgMgr()
    return wgMgr.organizePeers()
  },
})

/**
 * 設定取得
 */
export const getSettings = validAction('getSettings', {
  requireAuth: true,
  requireAdmin: true,
  next: async () => {
    const signinMessage = await getLocaleValue('signin_message')
    const topPageNotice = await getLocaleValue('top_page_notice')
    return { signinMessage, topPageNotice }
  },
})
export type Settings = ActionResultType<typeof getSettings>

/**
 * サインインメッセージ更新
 */
export const updateSigninMessage = validAction('updateSigninMessage', {
  schema: getLocaleFormSchema(200),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    await setLocaleValue('signin_message', JSON.stringify(req) === '{}' ? null : req)
  },
})

/**
 * トップページ通知更新
 */
export const updateTopPageNotice = validAction('updateTopPageNotice', {
  schema: getLocaleFormSchema(200),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    await setLocaleValue('top_page_notice', JSON.stringify(req) === '{}' ? null : req)
  },
})

/**
 * PostUp/Downスクリプト生成
 */
export const getPostUpDownScript = validAction('getPostUpDownScript', {
  schema: zReq({ interfaceName: zInterfaceName }),
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req: { interfaceName } }) => {
    const nif = await getDefaultNetworkInterface()
    if (nif) {
      return {
        up: `iptables -A FORWARD -i ${interfaceName} -j ACCEPT; iptables -t nat -A POSTROUTING -o ${nif} -j MASQUERADE`,
        down: `iptables -D FORWARD -i ${interfaceName} -j ACCEPT; iptables -t nat -D POSTROUTING -o ${nif} -j MASQUERADE`,
      }
    }
    return undefined
  },
})

/**
 * PostUp/Downスクリプト更新
 */
export const updateWgConfPostScript = validAction('updateWgConfPostScript', {
  schema: scWgConfPostScript,
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    await prisma.wgConf.update({ where: { id: 'main' }, data: req })
    const wgMgr = await refWgMgr()
    wgMgr.saveConf()
  },
})

/**
 * クライアント向け設定更新
 */
export const updateWgConfForClients = validAction('updateWgConfForClients', {
  schema: scWgConfForClients,
  requireAuth: true,
  requireAdmin: true,
  next: async ({ req }) => {
    await prisma.wgConf.update({ where: { id: 'main' }, data: req })
  },
})
