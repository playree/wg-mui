import { getSessionUser } from '@/config/auth-options'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { LinkOAuthClient, LinkedOAuthClient } from './client'
import { enableLinkOAuth, getOnetimeUser } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Link OAuth',
}

const LinkOAuthPage: FC<{ params: Promise<{ onetimeId: string }> }> = async (props) => {
  const params = await props.params
  const { onetimeId } = params

  const targetUser = await parseAction(getOnetimeUser({ onetimeId }))
  if (!targetUser || !targetUser.email) {
    return notFound()
  }

  const loginUser = await getSessionUser()

  if (loginUser?.id === targetUser.id) {
    await parseAction(enableLinkOAuth({ onetimeId }))
    return <LinkedOAuthClient oauthName={targetUser.oauth.name} />
  }

  return <LinkOAuthClient email={targetUser.email} oauthName={targetUser.oauth.name} />
}
export default LinkOAuthPage
