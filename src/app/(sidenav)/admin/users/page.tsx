import { UsersIcon } from '@/components/icons'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { FC } from 'react'

import { Title, UserListClient } from './client'
import { getSettings } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Users',
}

const UsersPage: FC = async () => {
  const { requiredPasswordScore } = await parseAction(getSettings())
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <UsersIcon className='mr-2' />
        <Title />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <UserListClient requiredPasswordScore={requiredPasswordScore} />
      </div>
    </div>
  )
}
export default UsersPage
