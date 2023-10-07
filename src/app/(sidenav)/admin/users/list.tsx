import { prisma } from '@/helpers/prisma'
import { FC, use } from 'react'

const getUserList = () => {
  console.debug('call getUserList')
  return prisma.user.getAllList()
}

export const UserList: FC = () => {
  const userList = use(getUserList())
  return (
    <>
      {userList.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
    </>
  )
}
