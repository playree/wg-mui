'use server'

import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'
import { getWgMgr } from '@/helpers/wgmgr'
import {
  chConfDir,
  createDir,
  genPrivateKey,
  genPublicKey,
  getDefaultNetworkInterface,
  getExeUser,
  isAccessibleDir,
  touchFile,
  touchFileSh,
} from '@/server-actions/cmd'

export const initializeWgConf = async (conf: InitializeWgConf) => {
  console.info('initializeWgConf:')

  // 初期化チェック
  if (await getWgMgr()) {
    throw new Error('Already initialized')
  }

  // 公開鍵生成
  const publicKey = await genPublicKey(conf.privateKey)
  if (!publicKey) {
    throw new Error('Failed to generate public key')
  }
  console.info('genPublicKey: ok')

  // DB保存
  await prisma.wgConf.create({ data: { ...conf, publicKey } })
  console.info('save WgConf: ok')

  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    throw new Error('WgMgr could not be loaded')
  }

  // 設定(peer)ディレクトリ作成
  if (!(await createDir(wgMgr.peerDirPath))) {
    throw new Error('Failed to create conf(peer) directory')
  }
  console.info('createWgConfDir: ok')

  // loader.sh 作成
  if (!(await touchFileSh(wgMgr.peerLoaderPath))) {
    throw new Error('Failed to create loader.sh file')
  }
  wgMgr.makePeerLoader()

  // 設定ファイル作成
  if (!(await touchFile(wgMgr.confPath))) {
    throw new Error('Failed to create conf file')
  }
  wgMgr.saveConf()
}

export const getPrivateKey = async () => {
  // 初期化チェック
  if (await getWgMgr()) {
    throw new Error('Already initialized')
  }

  return genPrivateKey()
}

export const getPostUpDownScript = async (interfaceName: string) => {
  // 初期化チェック
  if (await getWgMgr()) {
    throw new Error('Already initialized')
  }

  const nif = await getDefaultNetworkInterface()
  if (nif) {
    return {
      up: `iptables -A FORWARD -i ${interfaceName} -j ACCEPT; iptables -t nat -A POSTROUTING -o ${nif} -j MASQUERADE`,
      down: `iptables -D FORWARD -i ${interfaceName} -j ACCEPT; iptables -t nat -D POSTROUTING -o ${nif} -j MASQUERADE`,
    }
  }
  return undefined
}

export const checkConfDir = async (confDirPath: string) => {
  // 初期化チェック
  if (await getWgMgr()) {
    throw new Error('Already initialized')
  }

  if (await isAccessibleDir(confDirPath)) {
    // アクセス可能なら、undefinedを返却
    return undefined
  }

  // アクセス不可なら、実行ユーザー名を返却
  const exeUser = await getExeUser()
  return exeUser
}

export const changeConfDir = async (confDirPath: string) => {
  console.info('changeConfDir:')

  // 初期化チェック
  if (await getWgMgr()) {
    throw new Error('Already initialized')
  }

  return chConfDir(confDirPath)
}
