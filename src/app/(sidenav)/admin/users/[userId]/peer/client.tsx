'use client'

import { useSharedUIContext } from '@/app/context'
import { EllipsisHorizontalIcon, ExclamationTriangleIcon, PencilSquareIcon, TrashIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { gridStyles, textStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { dayformat } from '@/helpers/day'
import { TypePeer, TypeUser } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
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

import { CreatePeerButtonWithModal, UpdatePeerModal } from './edit'
import { deletePeer, getPeerList } from './server-actions'

export const Title: FC<{ user: TypeUser }> = ({ user }) => {
  const { t } = useLocale()
  return (
    <span className='mr-8 text-lg'>
      {t('item_peer_management')} - {user.name}
    </span>
  )
}

export const PeerListClient: FC<{ user: TypeUser }> = ({ user }) => {
  const { t } = useLocale()
  const { confirmModal } = useSharedUIContext()

  const list = usePageingList({
    load: () => parseAction(getPeerList({ userId: user.id })),
    sort: {
      init: { column: 'updatedAt', direction: 'descending' },
    },
  })

  const [targetUpdate, setTargetUpdate] = useState<TypePeer>()
  const updateModal = useDisclosure()
  const openUpdateModal = updateModal.onOpen

  useEffect(() => {
    console.debug('targetUpdate:', targetUpdate?.ip)
    if (targetUpdate) {
      openUpdateModal()
    }
  }, [openUpdateModal, targetUpdate])

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
              <TableColumn key='isDeleting' minWidth={60} allowsSorting>
                {t('item_deleting')}
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
                  <TableCell className={twMerge(textStyles({ color: 'red' }))}>
                    {peer.isDeleting && <ExclamationTriangleIcon />}
                  </TableCell>
                  <TableCell>{peer.remarks}</TableCell>
                  <TableCell>
                    <div className='text-xs'>{dayformat(peer.updatedAt, 'jp-simple')}</div>
                  </TableCell>
                  <TableCell>
                    {!peer.isDeleting && (
                      <Dropdown
                        showArrow
                        classNames={{
                          base: 'before:bg-default-200',
                          content:
                            'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                        }}
                      >
                        <DropdownTrigger>
                          <Button isIconOnly variant='flat' color='primary' className='h-fit px-2 py-1'>
                            <EllipsisHorizontalIcon />
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu aria-label='actions'>
                          <DropdownItem
                            key='edit'
                            startContent={<PencilSquareIcon />}
                            onPress={() => {
                              setTargetUpdate(peer)
                            }}
                          >
                            {t('item_edit')}
                          </DropdownItem>
                          <DropdownItem
                            key='delete'
                            className='text-danger'
                            color='danger'
                            startContent={<TrashIcon />}
                            onPress={async () => {
                              const ok = await confirmModal().confirm({
                                title: t('item_delete_confirm'),
                                text: t('msg_peer_delete', { peer: peer.ip }),
                                requireCheck: true,
                                autoClose: false,
                              })
                              if (ok) {
                                await parseAction(deletePeer({ ip: peer.ip }))
                                await intervalOperation()
                                list.reload()
                                confirmModal().close()
                              }
                            }}
                          >
                            {t('item_delete')}
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    )}
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
    </>
  )
}
