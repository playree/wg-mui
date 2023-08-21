'use client'

import { ArrowRightOnRectangleIcon } from '@/components/icons'
import { useLocale } from '@/locale/client'
import { Link } from '@nextui-org/link'
import { signOut } from 'next-auth/react'

export const SignOutLink = () => {
  const { t } = useLocale()
  return (
    <Link className='cursor-pointer text-default-500' aria-label='SignOut' onPress={() => signOut()}>
      <ArrowRightOnRectangleIcon className='mr-1' />
      {t('menu_signout')}
    </Link>
  )
}
