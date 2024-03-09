'use client'

import acceptLanguageParser from 'accept-language-parser'
import { FC, createContext, useCallback, useContext, useState } from 'react'

import { getCookie } from '../cookie/client'
import { LocaleConfig } from './types'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (item: string, values?: { [key: string]: string | number | null | undefined }) => string
}

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType)

const useLocaleContext = (localeConfig: LocaleConfig, acceptLanguage: string | null): LocaleContextType => {
  const getLocale = () => {
    const localeCookie = getCookie('locale')
    if (localeCookie && localeConfig.locales.includes(localeCookie)) {
      // Cookieのロケールが有効な場合
      return localeCookie
    }

    // accept-languageを優先し、それ以外はlocalesの0番目をデフォルトとする
    return (
      acceptLanguageParser.pick(localeConfig.locales, acceptLanguage ?? localeConfig.locales[0], {
        loose: true,
      }) || localeConfig.locales[0]
    )
  }

  const { resources } = localeConfig
  const [locale, setLocale] = useState(getLocale())

  return {
    locale,
    setLocale: useCallback((current: string) => {
      setLocale(current)
    }, []),
    t: useCallback(
      (item, values) => {
        if (resources[locale]) {
          const template = resources[locale][item] || resources[localeConfig.locales[0]][item] || ''
          return !values
            ? template
            : new Function(...Object.keys(values), `return \`${template}\`;`)(
                ...Object.values(values).map((value) => value ?? ''),
              )
        }
        return ''
      },
      [locale, localeConfig.locales, resources],
    ),
  }
}

export const LocaleProvider: FC<{
  children: React.ReactNode
  config: LocaleConfig
  acceptLanguage: string | null
}> = ({ children, config, acceptLanguage }) => {
  const ctx = useLocaleContext(config, acceptLanguage)
  return <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
}

export const useLocale = <T extends string = string>() => {
  const { locale, setLocale, t } = useContext(LocaleContext)
  return {
    locale,
    setLocale,
    t: t as (item: T, values?: { [key: string]: string | number | null | undefined }) => string,
  }
}
