import {
  addWgPeer,
  disableWgAutoStart,
  ebableWgAutoStart,
  genPublicKey,
  getWgStatus,
  getWgVersion,
  isWgAutoStartEnabled,
  isWgStarted,
  startWg,
  stopWg,
} from '@/server-actions/cmd'
import { Peer, WgConf } from '@prisma/client'
import { unlinkSync, writeFileSync } from 'fs'
import { Address4 } from 'ip-address'
import { IIniObject, stringify } from 'js-ini'
import path from 'path'

import { errSystemError } from './error'
import { prisma } from './prisma'
import { CreatePeer } from './schema'

export type PeerStatus = {
  publicKey: string
  ip?: string
  endpoint?: string
  transfer?: string
  latestHandshake?: string
}

const writeConf = (confPath: string, data: IIniObject) =>
  writeFileSync(confPath, stringify(data, { spaceBefore: true, spaceAfter: true }) + '\n')

const convKiB = (text: string) => {
  const [num, unit] = text.split(' ')
  switch (unit) {
    case 'KiB':
      return Number(num)
    case 'MiB':
      return Number(num) * 1024
    case 'GiB':
      return Number(num) * 1024 * 1024
    case 'TiB':
      return Number(num) * 1024 * 1024 * 1024
  }
  return 0
}

export const convTransfer = (transferText?: string) => {
  if (transferText) {
    try {
      const tmp = transferText.split(' received, ')
      const receiveText = tmp[0]
      const sendText = tmp[1].replace(' sent', '')
      return {
        sendText,
        send: convKiB(sendText),
        receiveText,
        receive: convKiB(receiveText),
      }
    } catch {
      //
    }
  }

  return {
    sendText: '0 B',
    send: 0,
    receiveText: '0 B',
    receive: 0,
  }
}

export class WgMgr {
  conf: WgConf
  targetAddress: string[]
  ip4: Address4
  isNeedRestart: boolean

  constructor(wgConf: WgConf) {
    this.conf = wgConf
    this.ip4 = new Address4(wgConf.address)

    const start = this.ip4.startAddressExclusive().bigInteger()
    const end = this.ip4.endAddress().bigInteger()
    const addressList = []
    for (let i = start; i < end; i++) {
      addressList.push(Address4.fromBigInteger(i).address)
    }
    this.targetAddress = addressList
    this.isNeedRestart = false
  }

  get confPath() {
    return path.join(this.conf.confDirPath, `${this.conf.interfaceName}.conf`)
  }

  get peerDirPath() {
    return path.join(this.conf.confDirPath, `${this.conf.interfaceName}_peer`)
  }

  get peerLoaderPath() {
    return path.join(this.conf.confDirPath, `${this.conf.interfaceName}_peer`, 'loader.sh')
  }

  async getWgVersion() {
    return getWgVersion()
  }

  async isWgStarted() {
    return isWgStarted(this.conf.interfaceName)
  }

  async startWg() {
    return startWg(this.conf.interfaceName)
  }

  async stopWg() {
    return stopWg(this.conf.interfaceName)
  }

  async isWgAutoStartEnabled() {
    return isWgAutoStartEnabled(this.conf.interfaceName)
  }

  async ebableWgAutoStart() {
    return ebableWgAutoStart(this.conf.interfaceName)
  }

  async disableWgAutoStart() {
    return disableWgAutoStart(this.conf.interfaceName)
  }

  async getUsedAddressList() {
    const peerList = await prisma.peer.findMany({ select: { ip: true } })
    return peerList.map((value) => value.ip)
  }

  async getFreeAddressList() {
    const usedAddressList = await this.getUsedAddressList()
    return this.targetAddress.filter((value) => {
      if (value === this.ip4.addressMinusSuffix) {
        return false
      }
      return !usedAddressList.includes(value)
    })
  }

  saveConf() {
    const postUp = this.conf.postUp ? `${this.conf.postUp}; ` : ''
    writeConf(this.confPath, {
      Interface: {
        Address: this.conf.address,
        ListenPort: this.conf.listenPort,
        PrivateKey: this.conf.privateKey,
        PostUp: `${postUp}${this.peerLoaderPath}`,
        PostDown: this.conf.postDown || '',
      },
    })
  }

  makePeerLoader() {
    const peerPath = path.join(this.conf.confDirPath, `${this.conf.interfaceName}_peer`, '*_peer.conf')
    writeFileSync(
      this.peerLoaderPath,
      `#! /bin/bash
for peer in $(ls ${peerPath}); do
  wg addconf ${this.conf.interfaceName} $peer
done
exit 0
`,
    )
  }

  getPeerPath(ip: string) {
    const ipFilename = ip.replaceAll('.', '-')
    return path.join(this.peerDirPath, `${ipFilename}_peer.conf`)
  }

  /**
   * ピア作成
   * @param data
   * @returns
   */
  async createPeer(data: CreatePeer) {
    const publicKey = await genPublicKey(data.privateKey)
    if (!publicKey) {
      throw new Error('Failed to generate public key')
    }
    // DB更新(作成)
    const peer = await prisma.peer.create({ data: { ...data, publicKey } })

    // Peerファイル作成
    const peerPath = this.getPeerPath(peer.ip)
    writeConf(peerPath, {
      Peer: {
        PublicKey: peer.publicKey,
        AllowedIPs: `${peer.ip}/32`,
      },
    })

    if (await this.isWgStarted()) {
      // WireGurd起動中の場合は追加コマンド
      await addWgPeer(this.conf.interfaceName, peerPath)
    }

    return peer
  }

  /**
   * ピア削除
   * @param ip
   * @returns
   */
  async deletePeer(ip: string) {
    // Peer情報取得
    const peer = await prisma.peer.findUnique({ where: { ip } })
    if (!peer) {
      throw new Error('Target peer does not exist')
    }

    // Peerファイル削除
    const peerPath = this.getPeerPath(peer.ip)
    unlinkSync(peerPath)

    // DB更新(削除予約)
    await prisma.peer.update({ where: { ip }, data: { isDeleting: true } })

    // 削除を反映させるためにはWireGurdの再起動が必要
    this.isNeedRestart = true
    return
  }

  async getPeerStatus() {
    const statusText = await getWgStatus(this.conf.interfaceName)
    if (statusText) {
      const peerStatusMap: Record<string, PeerStatus> = {}
      const statusTextList = statusText.split('peer: ')
      if (statusTextList.length > 1) {
        statusTextList.shift()
        for (const statusText of statusTextList) {
          const statusParts = statusText.split('\n')
          const publicKey = statusParts.shift()
          if (statusParts.length > 0 && publicKey) {
            const peerStatus: PeerStatus = { publicKey }
            for (const status of statusParts) {
              if (status.indexOf('endpoint: ') > -1) {
                peerStatus.endpoint = status.split('endpoint: ')[1]
              } else if (status.indexOf('allowed ips: ') > -1) {
                peerStatus.ip = status.split('allowed ips: ')[1].split('/')[0]
              } else if (status.indexOf('latest handshake: ') > -1) {
                peerStatus.latestHandshake = status.split('latest handshake: ')[1]
              } else if (status.indexOf('transfer: ') > -1) {
                peerStatus.transfer = status.split('transfer: ')[1]
              }
            }
            if (peerStatus.ip) {
              peerStatusMap[peerStatus.ip] = peerStatus
            }
          }
        }
      }
      console.debug('peerStatusMap:', peerStatusMap)

      return peerStatusMap
    }

    return undefined
  }

  getPeerConf(peer: Peer) {
    return (
      stringify(
        {
          Interface: {
            PrivateKey: peer.privateKey,
            Address: `${peer.ip}/${this.ip4.subnetMask}`,
            DNS: this.conf.dns || undefined,
          },
          Peer: {
            PublicKey: this.conf.publicKey,
            EndPoint: this.conf.endPoint,
            AllowedIPs: peer.allowedIPs || '0.0.0.0/0',
            PersistentKeepalive: peer.persistentKeepalive,
          },
        } as IIniObject,
        { spaceBefore: true, spaceAfter: true, skipUndefined: true },
      ) + '\n'
    )
  }

  static async getWgMgr() {
    const wgConf = await prisma.wgConf.findUnique({ where: { id: 'main' } })
    console.debug('Load WgConf:', wgConf)
    return wgConf ? new WgMgr(wgConf) : undefined
  }
}

export const getWgMgr = async () => WgMgr.getWgMgr()
export const refWgMgr = async () => {
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw errSystemError()
  }
  return wgMgr
}
