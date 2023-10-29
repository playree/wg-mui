'use client'

import { PencilSquareIcon, TrashIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import type { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import { DeleteUserModal, UpdateUserModal } from './edit'

export const UserListClient: FC<{
  userList: TypeUser[]
}> = ({ userList }) => {
  const { t } = useLocale()
  const router = useRouter()

  const updateModal = useDisclosure()
  const openUpdateModal = updateModal.onOpen
  const [targetUpdate, setTargetUpdate] = useState<TypeUser>()

  const [targetDetele, setTargetDelete] = useState<TypeUser>()
  const deleteModal = useDisclosure()
  const openDeleteModal = deleteModal.onOpen

  useEffect(() => {
    console.debug('targetUpdate:', targetUpdate)
    if (targetUpdate) {
      openUpdateModal()
    }
  }, [openUpdateModal, targetUpdate])

  useEffect(() => {
    console.debug('targetDetele:', targetDetele)
    if (targetDetele) {
      openDeleteModal()
    }
  }, [openDeleteModal, targetDetele])

  return (
    <>
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
                    setTargetUpdate(user)
                  }}
                >
                  <PencilSquareIcon />
                </ExButton>
                <ExButton
                  isIconOnly
                  color='danger'
                  tooltip='削除'
                  onPress={() => {
                    setTargetDelete(user)
                  }}
                >
                  <TrashIcon />
                </ExButton>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <UpdateUserModal
        size='xl'
        isOpen={updateModal.isOpen}
        onOpenChange={updateModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetUpdate}
        updated={() => {
          router.refresh()
        }}
        onClose={() => setTargetUpdate(undefined)}
      />
      <DeleteUserModal
        size='xl'
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetDetele}
        updated={() => {
          router.refresh()
        }}
        onClose={() => setTargetDelete(undefined)}
      />
    </>
  )
}
