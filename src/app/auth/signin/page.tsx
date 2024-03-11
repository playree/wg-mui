import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { FC } from 'react'

import { SignInClient } from './client'
import { getSSResource } from './server-actions'

export const metadata: Metadata = {
  title: 'SignIn',
}

const SignIn: FC = async () => {
  const ssr = await parseAction(getSSResource())
  return <SignInClient ssr={ssr} />
}
export default SignIn
