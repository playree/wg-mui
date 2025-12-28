import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { EmailChangeClient } from './client'
import { changeEmail } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Email Change',
}

const EmailConfirmPage: FC<{ params: Promise<{ onetimeId: string }> }> = async (props) => {
  const params = await props.params
  const { onetimeId } = params
  let email

  try {
    email = await parseAction(changeEmail({ onetimeId }))
    if (!email) {
      return notFound()
    }
  } catch {
    return notFound()
  }
  return <EmailChangeClient email={email}></EmailChangeClient>
}
export default EmailConfirmPage
