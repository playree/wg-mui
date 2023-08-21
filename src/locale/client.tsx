'use client'

import { FC, createContext, useCallback, useContext, useState } from 'react'

import { localeConfig } from './config'
import { LocaleItem, locales } from './locales'

type LocaleContextType = {
  locale: string
  setLocale: (locale: string) => void
  t: (item: LocaleItem) => string
}

const LocaleContext = createContext<LocaleContextType>({} as LocaleContextType)

const useLocaleContext = (): LocaleContextType => {
  const [locale, setLocale] = useState(localeConfig.locales[0])

  return {
    locale,
    setLocale: useCallback((current: string) => {
      setLocale(current)
    }, []),
    t: useCallback(
      (item: LocaleItem) => {
        if (locales[item]) {
          return locales[item][locale as 'en' | 'ja'] || ''
        }
        return ''
      },
      [locale],
    ),
  }
}

export const LocaleProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const ctx = useLocaleContext()
  return <LocaleContext.Provider value={ctx}>{children}</LocaleContext.Provider>
}

export const useLocale = () => useContext(LocaleContext)
