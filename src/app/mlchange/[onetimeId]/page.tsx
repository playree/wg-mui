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

  try {
    const email = await parseAction(changeEmail({ onetimeId }))
    if (!email) {
      return notFound()
    }
    return <EmailChangeClient email={email}></EmailChangeClient>
  } catch {
    return notFound()
  }
}
export default EmailConfirmPage
