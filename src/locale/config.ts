import { LocaleConfig } from '@/components/nextekit/locale/types'

import { en } from './en'
import { ja } from './ja'

export const localeConfig: LocaleConfig = {
  locales: ['ja', 'en'],
  resources: { ja, en },
  cookie: {
    name: 'locale',
    maxAge: 86400 * 365,
  },
}
