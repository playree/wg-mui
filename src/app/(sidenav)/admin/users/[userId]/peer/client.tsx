'use client'

import { PencilSquareIcon, TrashIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { dayformat } from '@/helpers/day'
import { TypePeer, TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import {
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

import { CreatePeerButtonWithModal, DeletePeerModal, UpdatePeerModal } from './edit'
import { getPeerList } from './server-actions'

export const PeerManagementTitle: FC<{ user: TypeUser }> = ({ user }) => {
  const { t } = useLocale()
  return (
    <span className='mr-8 text-lg'>
      {t('item_peer_management')} - {user.name}
    </span>
  )
}

export const PeerListClient: FC<{ user: TypeUser }> = ({ user }) => {
  const { t } = useLocale()

  const list = usePageingList({
    load: () => parseAction(getPeerList({ userId: user.id })),
    sort: {
      init: { column: 'updatedAt', direction: 'descending' },
    },
  })

  const [targetUpdate, setTargetUpdate] = useState<TypePeer>()
  const updateModal = useDisclosure()
  const openUpdateModal = updateModal.onOpen

  const [targetDelete, setTargetDelete] = useState<TypePeer>()
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
        <div className='col-span-10'></div>
        <div className='col-span-2 flex flex-row-reverse items-center'>
          <CreatePeerButtonWithModal user={user} updated={() => list.reload()} />
        </div>
        <div className='col-span-12'>
          <Table
            aria-label='peer list'
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
              <TableColumn key='ip' minWidth={120} allowsSorting>
                {t('item_address')}
              </TableColumn>
              <TableColumn key='remarks'>{t('item_remarks')}</TableColumn>
              <TableColumn key='updatedAt' allowsSorting>
                {t('item_updated_at')}
              </TableColumn>
              <TableColumn width={120} align='center'>
                {t('item_action')}
              </TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(peer) => (
                <TableRow key={peer.ip}>
                  <TableCell>{peer.ip}</TableCell>
                  <TableCell>{peer.remarks}</TableCell>
                  <TableCell>
                    <div className='text-xs'>{dayformat(peer.updatedAt, 'jp-simple')}</div>
                  </TableCell>
                  <TableCell>
                    <ExButton
                      isIconOnly
                      isSmart
                      color='primary'
                      tooltip={t('item_edit')}
                      onPress={() => {
                        setTargetUpdate(peer)
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
                        setTargetDelete(peer)
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
      <UpdatePeerModal
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
      <DeletePeerModal
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
