'use client'

import acceptLanguageParser from 'accept-language-parser'
import { FC, createContext, useCallback, useContext, useRef, useState } from 'react'

import { getCookie } from '../cookie/client'
import { LocaleConfig } from './types'

type LocaleContextType = {
  locale: string
  lcConfig: LocaleConfig
  defaultLocale: string
  setLocale: (locale: string) => void
  t: (item: string, values?: { [key: string]: string | number | null | undefined }) => string
}

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType)

const useLocaleContext = (
  localeConfig: LocaleConfig,
  defaultLocale: string,
  acceptLanguage: string | null,
): LocaleContextType => {
  const getLocale = () => {
    const localeCookie = getCookie('locale')
    if (localeCookie && localeConfig.locales.includes(localeCookie)) {
      // Cookieのロケールが有効な場合
      return localeCookie
    }

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
    defaultLocale,
    setLocale: useCallback((current: string) => {
      setLocale(current)
    }, []),
    t: useCallback(
      (item, values) => {
        const { resources } = lcConfig.current
        const lc = resources[locale] ? locale : defaultLocale

        const template = resources[lc][item] || resources[defaultLocale][item] || ''
        return !values
          ? template
          : new Function(...Object.keys(values), `return \`${template}\`;`)(
              ...Object.values(values).map((value) => value ?? ''),
            )
      },
      [defaultLocale, locale],
    ),
  }
}

export const LocaleProvider: FC<{
  children: React.ReactNode
  config: LocaleConfig
  defaultLocale: string
  acceptLanguage: string | null
}> = ({ children, config, defaultLocale, acceptLanguage }) => {
  const ctx = useLocaleContext(config, defaultLocale, acceptLanguage)
  return <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
}

export const useLocale = <T extends string = string>() => {
  const { t, ...context } = useContext(LocaleContext)
  return {
    ...context,
    t: t as (item: T, values?: { [key: string]: string | number | null | undefined }) => string,
  }
}
