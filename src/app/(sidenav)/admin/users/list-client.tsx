'use client'

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { FC } from 'react'

export const UserListClient: FC<{
  userList: {
    id: string
    name: string
    isNotInit: boolean
    isAdmin: boolean
    updatedAt: Date
    createdAt: Date
  }[]
}> = ({ userList }) => {
  return (
    <Table aria-label='user list'>
      <TableHeader>
        <TableColumn>NAME</TableColumn>
      </TableHeader>
      <TableBody items={userList}>
        {(user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
