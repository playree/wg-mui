import { KeyJson, getKeyValueJson, setKeyValueJson } from '@/helpers/key-value'

import { localeConfig } from './config'

export const getLocaleValue = async (key: KeyJson) => {
  const data = await getKeyValueJson(key)
  const lcValue: Record<string, string> = {}
  localeConfig.locales.forEach((lc) => {
    lcValue[lc] = data ? (data[lc] as string) || '' : ''
  })
  return lcValue
}

export const setLocaleValue = setKeyValueJson
