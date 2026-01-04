'use server'

import { isEnvOAuthEnabled } from '@/helpers/env'
import { ActionResultType, validAction } from '@/helpers/server'
import { getLocaleValue } from '@/locale/server'
import { cookies } from 'next/headers'

/**
 * サーバーサイドリソース取得
 */
export const getSSResource = validAction('getSSResource', {
  next: async () => {
    const signinMessage = await getLocaleValue('signin_message')
    return {
      isGoogleEnabled: isEnvOAuthEnabled('google'),
      isGitLabEnabled: isEnvOAuthEnabled('gitlab'),
      signinMessage,
    }
  },
})
export type SSResource = ActionResultType<typeof getSSResource>

/**
 * Cookie(authjs.session-token)削除
 */
export const deleteSessionToken = validAction('deleteSessionToken', {
  next: async () => {
    const cookieStore = await cookies()
    cookieStore.delete('authjs.session-token')
    cookieStore.delete('__Secure-authjs.session-token')
  },
})
