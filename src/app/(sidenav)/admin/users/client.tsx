'use client'

import { ComputerDesktopIcon, PencilSquareIcon, TrashIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { gridStyles } from '@/components/styles'
import { dayformat } from '@/helpers/day'
import type { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import {
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react'
import { useAsyncList } from '@react-stately/data'
import { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { getLabelList } from '../labels/server-actions'
import { CreateUserButtonWithModal, DeleteUserModal, UpdateUserModal } from './edit'
import { getUserList } from './server-actions'

export const UsersTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_users')}</span>
}

export const UserListClient: FC = () => {
  const { t } = useLocale()

  const list = usePageingList({
    load: async () => {
      const userList = await getUserList({ withLabel: true, withPeer: true })
      return userList.ok ? userList.data : []
    },
    sort: {
      init: { column: 'updatedAt', direction: 'descending' },
    },
    filter: {
      init: { free: '', label: '' },
      proc: (item, filters) => {
        if (filters.free) {
          // フリー入力あり
          if (item.name.indexOf(filters.free) < 0) {
            // 該当なし
            return false
          }
        }

        if (filters.label) {
          // ラベル指定あり
          if (item.labelList) {
            for (const label of item.labelList) {
              if (label.id === filters.label) {
                // 該当あり
                return true
              }
            }
            // 該当なし
            return false
          }
        }

        return true
      },
    },
  })

  const labelList = useAsyncList({
    load: async () => {
      const labelList = await getLabelList({})
      return { items: labelList.ok ? labelList.data : [] }
    },
  })

  const [targetUpdate, setTargetUpdate] = useState<TypeUser>()
  const updateModal = useDisclosure()
  const openUpdateModal = updateModal.onOpen

  const [targetDelete, setTargetDelete] = useState<TypeUser>()
  const deleteModal = useDisclosure()
  const openDeleteModal = deleteModal.onOpen

  useEffect(() => {
    console.debug('targetUpdate:', targetUpdate)
    if (targetUpdate) {
      openUpdateModal()
    }
  }, [openUpdateModal, targetUpdate])

  useEffect(() => {
    console.debug('targetDelete:', targetDelete)
    if (targetDelete) {
      openDeleteModal()
    }
  }, [openDeleteModal, targetDelete])

  return (
    <>
      <div className={twMerge(gridStyles(), 'w-full')}>
        <div className='col-span-5'>
          <Input
            type='text'
            label={t('item_username')}
            placeholder={t('msg_enter_search_word')}
            onChange={(el) => {
              list.setFilter({ free: el.target.value })
            }}
          />
        </div>
        <div className='col-span-5'>
          <Select
            label={t('item_label')}
            variant='bordered'
            items={labelList.items}
            onChange={(el) => {
              console.debug('select change:', el.target.value)
              list.setFilter({ label: el.target.value })
            }}
          >
            {(label) => (
              <SelectItem key={label.id} textValue={label.name}>
                <span className='text-small'>{label.name}</span>
              </SelectItem>
            )}
          </Select>
        </div>
        <div className='col-span-2 flex flex-row-reverse items-center'>
          <CreateUserButtonWithModal updated={() => list.reload()} labelList={labelList} />
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
              <TableColumn key='name' minWidth={120} allowsSorting>
                {t('item_username')}
              </TableColumn>
              <TableColumn key='isAdmin' width={120} allowsSorting>
                {t('item_isadmin')}
              </TableColumn>
              <TableColumn>{t('item_label')}</TableColumn>
              <TableColumn>{t('item_peer')}</TableColumn>
              <TableColumn key='updatedAt' allowsSorting>
                {t('item_updated_at')}
              </TableColumn>
              <TableColumn width={120} align='center'>
                {t('item_action')}
              </TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <OnOffChip isEnable={user.isAdmin} messageOn={t('item_true')} messageOff={t('item_false')} />
                  </TableCell>
                  <TableCell>
                    {user.labelList?.map((value) => {
                      return (
                        <Chip key={value.id} variant='faded' size='sm'>
                          {value.name}
                        </Chip>
                      )
                    })}
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center'>
                      <Chip variant='faded' size='sm'>
                        {user.peerIpList?.length || 0}
                      </Chip>
                      <ExButton
                        isIconOnly
                        isSmart
                        color='primary'
                        tooltip={t('item_peer_management')}
                        href={`/admin/users/${user.id}/peer`}
                      >
                        <ComputerDesktopIcon />
                      </ExButton>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className='text-xs'>{dayformat(user.updatedAt, 'jp-simple')}</div>
                  </TableCell>
                  <TableCell>
                    <ExButton
                      isIconOnly
                      isSmart
                      color='primary'
                      tooltip={t('item_edit')}
                      onPress={() => {
                        setTargetUpdate(user)
                      }}
                    >
                      <PencilSquareIcon />
                    </ExButton>
                    <ExButton
                      isIconOnly
                      isSmart
                      color='danger'
                      tooltip={t('item_delete')}
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
        labelList={labelList}
        onClose={() => setTargetUpdate(undefined)}
      />
      <DeleteUserModal
        size='xl'
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetDelete}
        updated={() => {
          list.reload()
        }}
        onClose={() => setTargetDelete(undefined)}
      />
    </>
  )
}
