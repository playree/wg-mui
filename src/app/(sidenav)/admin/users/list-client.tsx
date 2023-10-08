'use client'

import type { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { FC } from 'react'

export const UserListClient: FC<{
  userList: TypeUser[]
}> = ({ userList }) => {
  const { t } = useLocale()

  return (
    <Table aria-label='user list'>
      <TableHeader>
        <TableColumn>{t('item_username')}</TableColumn>
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
