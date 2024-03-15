import { getSessionUser } from '@/config/auth-options'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { LinkGoogleClient, LinkedGoogleClient } from './client'
import { enableLinkGoogle, getOnetimeGoogleUser } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Link OAuth',
}

const LinkGooglePage: FC<{ params: { onetimeId: string } }> = async ({ params: { onetimeId } }) => {
  const targetUser = await parseAction(getOnetimeGoogleUser({ onetimeId }))
  if (!targetUser || !targetUser.email) {
    return notFound()
  }

  const loginUser = await getSessionUser()

  if (loginUser?.id === targetUser.id) {
    await enableLinkGoogle()
    return <LinkedGoogleClient />
  }

  return <LinkGoogleClient email={targetUser.email} />
}
export default LinkGooglePage
