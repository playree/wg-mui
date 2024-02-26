'use server'

import { prisma } from '@/helpers/prisma'
import { scInitializeWgConf, scUserPassword, zConfDirPath, zInterfaceName, zReq } from '@/helpers/schema'
import { validAction } from '@/helpers/server'
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

/**
 * 初期設定済みチェック
 */
export const isInitialized = validAction('isInitialized', {
  next: async () => {
    return !!(await getWgMgr())
  },
})

/**
 * 管理者存在チェック
 */
export const existAdminUser = validAction('existAdminUser', {
  next: async () => {
    // 初期化チェック
    if (await getWgMgr()) {
      throw new Error('Already initialized')
    }
    const adminList = await prisma.user.findMany({ where: { isAdmin: true } })
    return !!adminList.length
  },
})

/**
 * 管理者ユーザー作成
 */
export const createAdminUser = validAction('createAdminUser', {
  schema: scUserPassword,
  next: async ({ req }) => {
    // 初期化チェック
    if (await getWgMgr()) {
      throw new Error('Already initialized')
    }
    const user = await prisma.user.createUser({
      name: req.username,
      password: req.password,
      isAdmin: true,
      labelList: new Set([]),
    })
    return user
  },
})

/**
 * 初期設定
 */
export const initializeWgConf = validAction('initializeWgConf', {
  schema: scInitializeWgConf,
  next: async ({ req: conf }) => {
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
  },
})

/**
 * 秘密鍵生成
 */
export const getPrivateKey = validAction('getPrivateKey', {
  next: async () => {
    // 初期化チェック
    if (await getWgMgr()) {
      throw new Error('Already initialized')
    }

    return genPrivateKey()
  },
})

/**
 * PostUp/Downスクリプト生成
 */
export const getPostUpDownScript = validAction('getPostUpDownScript', {
  schema: zReq({ interfaceName: zInterfaceName }),
  next: async ({ req: { interfaceName } }) => {
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
  },
})

/**
 * ConfDirチェック
 */
export const checkConfDir = validAction('checkConfDir', {
  schema: zReq({ confDirPath: zConfDirPath }),
  next: async ({ req: { confDirPath } }) => {
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
  },
})

/**
 * ConfDirアクセス権変更
 */
export const changeConfDir = validAction('changeConfDir', {
  schema: zReq({ confDirPath: zConfDirPath }),
  next: async ({ req: { confDirPath } }) => {
    // 初期化チェック
    if (await getWgMgr()) {
      throw new Error('Already initialized')
    }

    return chConfDir(confDirPath)
  },
})
