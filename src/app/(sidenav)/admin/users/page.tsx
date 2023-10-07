import { FC, Suspense } from 'react'

import { UserList } from './list'

const UsersPage: FC = () => {
  return (
    <Suspense fallback='Loading'>
      <UserList />
    </Suspense>
  )
}
export default UsersPage
