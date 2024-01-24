'use server'

import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'
import { getWgMgr } from '@/helpers/wgmgr'
import { createWgConfDir, genPublicKey, touchFile } from '@/server-actions/cmd'

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

  // 設定ディレクトリ作成
  if (!(await createWgConfDir(wgMgr.conf.confDirPath))) {
    throw new Error('Failed to create conf directory')
  }
  console.info('createWgConfDir: ok')

  // 設定ファイル作成
  if (!(await touchFile(wgMgr.confPath))) {
    throw new Error('Failed to create conf file')
  }
  // 設定保存
  wgMgr.saveConf()
}
