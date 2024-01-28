import { LocaleConfig } from '@/components/nextekit/locale/types'

import { en } from './en'
import { ja } from './ja'

export const localeConfig: LocaleConfig = {
  locales: ['en', 'ja'],
  resources: { en, ja },
  cookie: {
    name: 'locale',
    maxAge: 86400 * 365,
  },
}
