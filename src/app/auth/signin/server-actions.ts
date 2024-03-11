'use server'

import { ActionResultType, validAction } from '@/helpers/server'
import { getLocaleValue } from '@/locale/server'

/**
 * サーバーサイドリソース取得
 */
export const getSSResource = validAction('getSSResource', {
  next: async () => {
    const isGoogleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    const signinMessage = await getLocaleValue('signin_message')
    return {
      isGoogleEnabled,
      signinMessage,
    }
  },
})
export type SSResource = ActionResultType<typeof getSSResource>
