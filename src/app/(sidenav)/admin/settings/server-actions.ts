'use server'

import { runCmd } from '@/helpers/cmd'

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
  return res.error ? undefined : res.stdout
}
