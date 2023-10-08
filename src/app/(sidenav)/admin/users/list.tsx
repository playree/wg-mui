import { prisma } from '@/helpers/prisma'
import { FC, use } from 'react'

import { UserListClient } from './list-client'

const getUserList = () => {
  console.debug('call getUserList')
  return prisma.user.getAllList()
}

export const UserList: FC = () => {
  const userList = use(getUserList())
  return <UserListClient userList={userList} />
}
