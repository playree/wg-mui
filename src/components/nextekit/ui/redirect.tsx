'use client'

import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'

export const RedirectComponent: FC<{
  redirectUrl: string
}> = ({ redirectUrl }) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(redirectUrl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <></>
}
