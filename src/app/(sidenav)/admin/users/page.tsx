import { UsersIcon } from '@/components/icons'
import { Loading } from '@/components/nextekit/ui/loading'
import { FC, Suspense } from 'react'

import { CreateUserButtonWithModal } from './edit'
import { UserList } from './list'

const UsersPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <UsersIcon className='mr-2' />
        <span className='mr-8 text-lg'>ユーザー管理</span>
        <CreateUserButtonWithModal />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <Suspense fallback={<Loading />}>
          <UserList />
        </Suspense>
      </div>
    </div>
  )
}
export default UsersPage
