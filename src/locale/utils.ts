import { LocaleItem } from '.'
import { localeConfig } from './config'

export const t = (locale: string, item: LocaleItem, values?: { [key: string]: string | number | null | undefined }) => {
  const { resources, locales } = localeConfig
  const lc = resources[locale] ? locale : locales[0]

  const template = resources[lc][item] || resources[locales[0]][item] || ''
  return !values
    ? template
    : new Function(...Object.keys(values), `return \`${template}\`;`)(
        ...Object.values(values).map((value) => value ?? ''),
      )
}
