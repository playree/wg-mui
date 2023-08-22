'use client'

import { FC, createContext, useCallback, useContext, useState } from 'react'

import { LocaleConfig } from './types'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (item: string) => string
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
      (item) => {
        if (resources[locale]) {
          return resources[locale][item] || ''
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

export const useLocale = () => useContext(LocaleContext)
