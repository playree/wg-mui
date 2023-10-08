'use client'

import { PencilSquareIcon, TrashIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
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
        <TableColumn>{t('item_action')}</TableColumn>
      </TableHeader>
      <TableBody items={userList}>
        {(user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>
              <ExButton
                isIconOnly
                color='primary'
                tooltip='編集'
                onPress={() => {
                  //
                }}
              >
                <PencilSquareIcon />
              </ExButton>
              <ExButton
                isIconOnly
                color='danger'
                tooltip='削除'
                onPress={() => {
                  //
                }}
              >
                <TrashIcon />
              </ExButton>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
