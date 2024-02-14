'use server'

import { ExecException, exec } from 'child_process'

/**
 * Shell Command 実行
 * @param cmd
 * @returns
 */
export const runCmd = async (cmd: string) => {
  return new Promise<{
    error: ExecException | null
    stdout: string
    stderr: string
  }>((resolve) => {
    exec(cmd, (error, stdout, stderr) => {
      resolve({
        error,
        stdout,
        stderr,
      })
    })
  })
}

let exeUser: string
/**
 * 実行ユーザ取得
 * @returns
 */
export const getExeUser = async () => {
  if (exeUser) {
    return exeUser
  }

  const res = await runCmd(`whoami`)
  if (res.error) {
    console.debug('getExeUser:', res.stderr)
  } else {
    exeUser = res.stdout.replace(/\r?\n/g, '')
  }
  return res.error ? undefined : exeUser
}

/**
 * ディレクトリ作成
 * @param dirPath
 * @returns
 */
export const createDir = async (dirPath: string) => {
  const exeUser = await getExeUser()
  if (!exeUser) {
    return false
  }

  const res = await runCmd(`sudo mkdir -p ${dirPath}; sudo chown ${exeUser} ${dirPath}`)
  if (res.error) {
    console.debug('createDir:', res.stderr)
  }
  return !res.error
}

/**
 * ディレクトリアクセス確認
 * @param dirPath
 * @returns
 */
export const isAccessibleDir = async (dirPath: string) => {
  const res = await runCmd(`cd ${dirPath}`)
  if (res.error) {
    console.debug('isAccessibleDir:', res.stderr)
  }
  return !res.error
}

/**
 * ConfDirのアクセス権付与
 * @param dirPath
 * @returns
 */
export const chConfDir = async (confDirPath: string) => {
  const exeUser = await getExeUser()
  if (!exeUser) {
    return false
  }

  const res = await runCmd(`sudo chgrp ${exeUser} ${confDirPath}; sudo chmod g+x ${confDirPath}`)
  if (res.error) {
    console.debug('chmodConfDir:', res.stderr)
  }
  return !res.error
}

/**
 * ファイル作成
 * @param filePath
 * @returns
 */
export const touchFile = async (filePath: string) => {
  const exeUser = await getExeUser()
  if (!exeUser) {
    return false
  }

  const res = await runCmd(`sudo touch ${filePath}; sudo chown ${exeUser} ${filePath}`)
  if (res.error) {
    console.debug('createWgConfDir:', res.stderr)
  }
  return !res.error
}

/**
 * shファイル作成
 * @param filePath
 * @returns
 */
export const touchFileSh = async (filePath: string) => {
  const exeUser = await getExeUser()
  if (!exeUser) {
    return false
  }

  const res = await runCmd(`sudo touch ${filePath}; sudo chown ${exeUser} ${filePath}; sudo chmod 755 ${filePath}`)
  if (res.error) {
    console.debug('createWgConfDir:', res.stderr)
  }
  return !res.error
}

/**
 *
 * @returns IP Forward設定取得
 */
export const getIpForward = async () => {
  const res = await runCmd('sudo sysctl net.ipv4.ip_forward')
  if (res.error) {
    console.debug('getIpForward:', res.stderr)
  }
  return res.error ? undefined : res.stdout.replace(/\r?\n/g, '')
}

/**
 * WireGuard Version取得
 * @returns
 */
export const getWgVersion = async () => {
  const res = await runCmd('sudo wg -v')
  if (res.error) {
    console.debug('getWgVersion:', res.stderr)
  }
  return res.error ? undefined : res.stdout.split(' - ')[0]
}

/**
 * WireGuard 秘密鍵生成
 * @returns
 */
export const genPrivateKey = async () => {
  const res = await runCmd(`wg genkey`)
  if (res.error) {
    console.debug('genPrivateKey:', res.stderr)
  }
  return res.error ? undefined : res.stdout.replace(/\r?\n/g, '')
}

/**
 * WireGuard 公開鍵生成
 * @param privateKey
 * @returns
 */
export const genPublicKey = async (privateKey: string) => {
  const res = await runCmd(`echo ${privateKey} | wg pubkey`)
  if (res.error) {
    console.debug('genPublicKey:', res.stderr)
  }
  return res.error ? undefined : res.stdout.replace(/\r?\n/g, '')
}

/**
 * WireGuard 起動状態確認
 * @returns
 */
export const isWgStarted = async (interfaceName: string) => {
  const res = await runCmd(`sudo wg show ${interfaceName}`)
  if (res.error) {
    console.debug('isWgStarted:', res.stderr)
  }
  return !res.error
}

/**
 * WireGuard 起動
 * @returns
 */
export const startWg = async (interfaceName: string) => {
  const res = await runCmd(`sudo wg-quick up ${interfaceName}`)
  if (res.error) {
    console.debug('startWg:', res.stderr)
  }
  return !res.error
}

/**
 * WireGuard 停止
 * @returns
 */
export const stopWg = async (interfaceName: string) => {
  const res = await runCmd(`sudo wg-quick down ${interfaceName}`)
  if (res.error) {
    console.debug('stopWg:', res.stderr)
  }
  return !res.error
}

/**
 * WireGuard 自動起動設定確認
 * @returns
 */
export const isWgAutoStartEnabled = async (interfaceName: string) => {
  const res = await runCmd(`sudo systemctl is-enabled wg-quick@${interfaceName}`)
  if (res.error) {
    console.debug('isWgAutoStartEnabled:', res.stderr)
    return false
  }
  return res.stdout.replace(/\r?\n/g, '') === 'enabled'
}

/**
 * WireGuard 自動起動設定ON
 * @returns
 */
export const ebableWgAutoStart = async (interfaceName: string) => {
  const res = await runCmd(`sudo systemctl enable wg-quick@${interfaceName}`)
  if (res.error) {
    console.debug('ebableWgAutoStart:', res.stderr)
  }
  return !res.error
}

/**
 * WireGuard 自動起動設定OFF
 * @returns
 */
export const disableWgAutoStart = async (interfaceName: string) => {
  const res = await runCmd(`sudo systemctl disable wg-quick@${interfaceName}`)
  if (res.error) {
    console.debug('disableWgAutoStart:', res.stderr)
  }
  return !res.error
}

/**
 * WireGuard ステータス取得
 * @returns
 */
export const getWgStatus = async (interfaceName: string) => {
  const res = await runCmd(`sudo wg show ${interfaceName}`)
  if (res.error) {
    console.debug('isWgStarted:', res.stderr)
    return undefined
  }
  return res.stdout
}

/**
 * WireGuard Peer追加
 * @returns
 */
export const addWgPeer = async (interfaceName: string, peerPath: string) => {
  const res = await runCmd(`sudo wg addconf ${interfaceName} ${peerPath}`)
  if (res.error) {
    console.debug('addWgPeer:', res.stderr)
  }
  return !res.error
}

/**
 * デフォルトネットワークインターフェース取得
 * @returns
 */
export const getDefaultNetworkInterface = async () => {
  const res = await runCmd(`ip route show`)
  if (res.error) {
    console.debug('getDefaultNetworkInterface:', res.stderr)
    return undefined
  }
  const parts = res.stdout.split('\n')[0].split(' ')
  if (parts.length > 4) {
    return parts[4]
  }

  return undefined
}
