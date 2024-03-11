import { useLocale as ul } from '@/components/nextekit/locale/client'

import { LocaleItem } from '.'

export const useLocale = () => {
  const ulItem = ul<LocaleItem>()
  const fet = (fieldError?: { message?: string }) => {
    if (fieldError) {
      return ulItem.t(fieldError.message as LocaleItem) || fieldError.message
    }
    return undefined
  }
  const lvt = (localeValue: Record<string, string>) => {
    return localeValue[ulItem.locale] || localeValue[ulItem.defaultLocale] || ''
  }
  return {
    ...ulItem,
    fet,
    lvt,
  }
}
