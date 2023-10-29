import { FC, use } from 'react'

import { UserListClient } from './list-client'
import { getUserList } from './server-actions'

export const UserList: FC = () => {
  const userList = use(getUserList())
  return <UserListClient userList={userList} />
}
