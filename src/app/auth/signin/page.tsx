import { Metadata } from 'next'
import { FC } from 'react'

import { SignInClient } from './client'

export const metadata: Metadata = {
  title: 'SignIn',
}

const SignIn: FC = () => {
  const isGoogleEnabled = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  return <SignInClient isGoogleEnabled={isGoogleEnabled} />
}
export default SignIn
