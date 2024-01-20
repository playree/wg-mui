'use server'

import { prisma } from '@/helpers/prisma'
import { InitializeWgConf } from '@/helpers/schema'
import { createWgConfDir, genPublicKey } from '@/server-actions/cmd'

export const initializeWgConf = async (conf: InitializeWgConf) => {
  console.info('initializeWgConf:')

  // 公開鍵生成
  const publicKey = await genPublicKey(conf.privateKey)
  if (!publicKey) {
    throw new Error('Failed to generate public key')
  }
  console.info('genPublicKey: ok')

  // 設定ディレクトリ作成
  if (!createWgConfDir(conf.confDirPath)) {
    throw new Error('Failed to create conf directory')
  }
  console.info('createWgConfDir: ok')

  // DB保存
  await prisma.wgConf.create({ data: { ...conf, publicKey } })
  console.info('save WgConf: ok')
}
