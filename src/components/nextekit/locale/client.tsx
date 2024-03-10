'use client'

import acceptLanguageParser from 'accept-language-parser'
import { FC, createContext, useCallback, useContext, useRef, useState } from 'react'

import { getCookie } from '../cookie/client'
import { LocaleConfig } from './types'

type LocaleContextType = {
  locale: string
  lcConfig: LocaleConfig
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
    const defaultLocale = localeConfig.locales[0]
    return (
      acceptLanguageParser.pick(localeConfig.locales, acceptLanguage ?? defaultLocale, {
        loose: true,
      }) || defaultLocale
    )
  }

  const [locale, setLocale] = useState(getLocale())
  const lcConfig = useRef(localeConfig)

  return {
    locale,
    lcConfig: lcConfig.current,
    setLocale: useCallback((current: string) => {
      setLocale(current)
    }, []),
    t: useCallback(
      (item, values) => {
        const { resources, locales } = lcConfig.current
        const lc = resources[locale] ? locale : locales[0]

        const template = resources[lc][item] || resources[locales[0]][item] || ''
        return !values
          ? template
          : new Function(...Object.keys(values), `return \`${template}\`;`)(
              ...Object.values(values).map((value) => value ?? ''),
            )
      },
      [locale],
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
  const { t, ...context } = useContext(LocaleContext)
  return {
    ...context,
    t: t as (item: T, values?: { [key: string]: string | number | null | undefined }) => string,
  }
}
