import { KeyJson, getKeyValueJson, setKeyValueJson } from '@/helpers/key-value'

import { getEnvDefaultLocale } from '@/helpers/env'
import { LocaleItem } from '.'
import { localeConfig } from './config'

export const defaultLocale = getEnvDefaultLocale() || localeConfig.locales[0]

export const getLocaleValue = async (key: KeyJson) => {
  const data = await getKeyValueJson(key)
  const lcValue: Record<string, string> = {}
  localeConfig.locales.forEach((lc) => {
    lcValue[lc] = data ? (data[lc] as string) || '' : ''
  })
  return lcValue
}

export const setLocaleValue = setKeyValueJson

export const t = (locale: string, item: LocaleItem, values?: { [key: string]: string | number | null | undefined }) => {
  const { resources } = localeConfig
  const lc = resources[locale] ? locale : defaultLocale

  const template = resources[lc][item] || resources[defaultLocale][item] || ''
  return !values
    ? template
    : new Function(...Object.keys(values), `return \`${template}\`;`)(
        ...Object.values(values).map((value) => value ?? ''),
      )
}
