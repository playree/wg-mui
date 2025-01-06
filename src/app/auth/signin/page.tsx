import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { FC } from 'react'

import { authOptions } from '@/config/auth-options'
import { getServerSession } from 'next-auth/next'

import { SignInClient } from './client'
import { getSSResource } from './server-actions'

export const metadata: Metadata = {
  title: 'SignIn',
}

const SignIn: FC = async () => {
  const ssr = await parseAction(getSSResource())
  const session = await getServerSession(authOptions)

  return <SignInClient ssr={ssr} isError={!!session?.isError} />
}
export default SignIn
