import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { PasswordResetClient } from './client'
import { getSettings, isEnabledOnetimeId } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Reset Password',
}

const PasswordResetPage: FC<{ params: { onetimeId: string } }> = async ({ params: { onetimeId } }) => {
  try {
    const enabled = await parseAction(isEnabledOnetimeId({ onetimeId }))
    if (!enabled) {
      return notFound()
    }
  } catch {
    return notFound()
  }

  const { requiredPasswordScore } = await parseAction(getSettings())

  return <PasswordResetClient onetimeId={onetimeId} requiredPasswordScore={requiredPasswordScore}></PasswordResetClient>
}
export default PasswordResetPage
