import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { PasswordResetClient } from './client'
import { isEnabledOnetimeId } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Initialize',
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

  return <PasswordResetClient onetimeId={onetimeId}></PasswordResetClient>
}
export default PasswordResetPage
