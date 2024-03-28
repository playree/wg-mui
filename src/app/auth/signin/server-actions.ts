'use server'

import { isOAuthEnabled } from '@/helpers/env'
import { ActionResultType, validAction } from '@/helpers/server'
import { getLocaleValue } from '@/locale/server'

/**
 * サーバーサイドリソース取得
 */
export const getSSResource = validAction('getSSResource', {
  next: async () => {
    const signinMessage = await getLocaleValue('signin_message')
    return {
      isGoogleEnabled: isOAuthEnabled('google'),
      isGitLabEnabled: isOAuthEnabled('gitlab'),
      signinMessage,
    }
  },
})
export type SSResource = ActionResultType<typeof getSSResource>
