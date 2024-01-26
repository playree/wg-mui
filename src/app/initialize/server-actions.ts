'use server'

import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'
import { getWgMgr } from '@/helpers/wgmgr'
import { createDir, genPublicKey, touchFile, touchFileSh } from '@/server-actions/cmd'

export const initializeWgConf = async (conf: InitializeWgConf) => {
  console.info('initializeWgConf:')

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
