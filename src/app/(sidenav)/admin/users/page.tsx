import { UsersIcon } from '@/components/icons'
import { FC, Suspense } from 'react'

import { UserAdd } from './edit'
import { UserList } from './list'

const UsersPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <UsersIcon className='mr-2' />
        <span className='mr-8 text-lg'>ユーザー管理</span>
        <UserAdd />
      </div>

      <Suspense fallback='Loading'>
        <UserList />
      </Suspense>
    </div>
  )
}
export default UsersPage
