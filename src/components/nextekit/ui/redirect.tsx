'use client'

import { useRouter } from 'next/navigation'
import { FC } from 'react'

export const RedirectComponent: FC<{
  redirectUrl: string
}> = ({ redirectUrl }) => {
  const router = useRouter()
  router.replace(redirectUrl)
  return <></>
}
