'use client'

import { FC, createContext, useCallback, useContext, useState } from 'react'

import { LocaleConfig } from './types'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (item: string, values?: { [key: string]: string | number | null | undefined }) => string
}

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType)

const useLocaleContext = (localeConfig: LocaleConfig): LocaleContextType => {
  const { locales, resources } = localeConfig
  const [locale, setLocale] = useState(locales[0])

  return {
    locale,
    setLocale: useCallback((current: string) => {
      setLocale(current)
    }, []),
    t: useCallback(
      (item, values) => {
        if (resources[locale]) {
          const template = resources[locale][item] || ''
          return !values
            ? template
            : new Function(...Object.keys(values), `return \`${template}\`;`)(
                ...Object.values(values).map((value) => value ?? ''),
              )
        }
        return ''
      },
      [locale, resources],
    ),
  }
}

export const LocaleProvider: FC<{ children: React.ReactNode; config: LocaleConfig }> = ({ children, config }) => {
  const ctx = useLocaleContext(config)
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
