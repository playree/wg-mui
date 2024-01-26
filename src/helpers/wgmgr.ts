import { WgConf } from '@prisma/client'
import { writeFileSync } from 'fs'
import ini from 'ini'
import { Address4 } from 'ip-address'
import path from 'path'

import { prisma } from './prisma'

export class WgMgr {
  conf: WgConf
  targetAddress: string[]
  ip4: Address4

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

  async getUsedAddressList() {
    const peerList = await prisma.peer.findMany({ select: { ip: true } })
    return peerList.map((value) => value.ip)
  }

  async getFreeAddressList() {
    const usedAddressList = await this.getUsedAddressList()
    return this.targetAddress.filter((value) => !usedAddressList.includes(value))
  }

  saveConf() {
    writeFileSync(
      this.confPath,
      ini.stringify({
        Interface: {
          Address: this.conf.address,
          ListenPort: this.conf.listenPort,
          PrivateKey: this.conf.privateKey,
          PostUp: this.conf.postUp || '',
          PostDown: this.conf.postDown || '',
        },
      }),
    )
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

  static async getWgMgr() {
    const wgConf = await prisma.wgConf.findUnique({ where: { id: 'main' } })
    console.debug('Load WgConf:', wgConf)
    return wgConf ? new WgMgr(wgConf) : undefined
  }
}

let wgMgr: WgMgr | undefined

export const getWgMgr = async () => {
  if (!wgMgr) {
    wgMgr = await WgMgr.getWgMgr()
  }
  return wgMgr
}
