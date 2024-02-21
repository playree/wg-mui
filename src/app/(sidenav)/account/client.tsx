'use client'

import { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { FC } from 'react'

export const Title: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_account')}</span>
}

export const AccountViewClient: FC<{ account: TypeUser }> = ({ account }) => {
  return <div>{account.name}</div>
}
