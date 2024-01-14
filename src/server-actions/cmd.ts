'use server'

import { ExecException, exec } from 'child_process'

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

export const getWgVersion = async () => {
  const res = await runCmd('sudo wg -v')
  if (res.error) {
    console.debug('getWgVersion:', res.stderr)
  }
  return res.error ? undefined : res.stdout.split(' - ')[0]
}

export const getIpForward = async () => {
  const res = await runCmd('sudo sysctl net.ipv4.ip_forward')
  if (res.error) {
    console.debug('getIpForward:', res.stderr)
  }
  return res.error ? undefined : res.stdout.replace(/\r?\n/g, '')
}

export const genPrivateKey = async () => {
  const res = await runCmd(`wg genkey`)
  if (res.error) {
    console.debug('genPrivateKey:', res.stderr)
  }
  return res.error ? undefined : res.stdout.replace(/\r?\n/g, '')
}

export const genPublicKey = async (privateKey: string) => {
  const res = await runCmd(`echo ${privateKey} | wg pubkey`)
  if (res.error) {
    console.debug('genPublicKey:', res.stderr)
  }
  return res.error ? undefined : res.stdout.replace(/\r?\n/g, '')
}
