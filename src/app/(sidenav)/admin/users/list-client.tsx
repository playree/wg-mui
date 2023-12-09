'use client'

import { PencilSquareIcon, TrashIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { gridStyles } from '@/components/styles'
import type { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { DeleteUserModal, UpdateUserModal } from './edit'
import { getUserList } from './server-actions'

export const UserListClient: FC = () => {
  const { t } = useLocale()

  const list = usePageingList({
    load: getUserList,
    filter: {
      init: { free: '' },
      proc: (item, filters) => {
        return filters.free ? item.name.indexOf(filters.free) > -1 : true
      },
    },
  })
  const [filterText, setFilterText] = useState('')

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
      <div className={twMerge(gridStyles(), 'w-full')}>
        <div className='col-span-6'>
          <Input
            type='text'
            value={filterText}
            label={t('item_username')}
            placeholder={t('msg_enter_search_word')}
            onChange={(el) => {
              setFilterText(el.target.value)
              list.setFilters({ free: el.target.value })
            }}
          />
        </div>
        <div className='col-span-12'>
          <Table
            aria-label='user list'
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.onSortChange}
            bottomContent={
              <div className='flex w-full justify-center'>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color='secondary'
                  page={list.page}
                  total={list.total}
                  onChange={list.onPageChange}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn key='name' allowsSorting>
                {t('item_username')}
              </TableColumn>
              <TableColumn key='isAdmin' allowsSorting>
                {t('item_isadmin')}
              </TableColumn>
              <TableColumn>{t('item_action')}</TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <OnOffChip isEnable={user.isAdmin} messageOn={t('item_true')} messageOff={t('item_false')} />
                  </TableCell>
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
        </div>
      </div>
      <UpdateUserModal
        size='xl'
        isOpen={updateModal.isOpen}
        onOpenChange={updateModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetUpdate}
        updated={() => {
          list.reload()
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
          list.reload()
        }}
        onClose={() => setTargetDelete(undefined)}
      />
    </>
  )
}
