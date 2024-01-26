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
 * WireGuard秘密鍵生成
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
 * WireGuard公開鍵生成
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
