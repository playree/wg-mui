import { UsersIcon } from '@/components/icons'
import { Metadata } from 'next'
import { FC } from 'react'

import { UserListClient, UsersTitle } from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Users',
}

const UsersPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <UsersIcon className='mr-2' />
        <UsersTitle />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <UserListClient />
      </div>
    </div>
  )
}
export default UsersPage
