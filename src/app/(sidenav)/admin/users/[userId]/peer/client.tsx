'use client'

import { usePageingList } from '@/components/nextekit/list/paging'
import { gridStyles } from '@/components/styles'
import { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { CreatePeerButtonWithModal } from './edit'
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
    load: () => getPeerList(user.id),
    sort: {
      init: { column: 'updatedAt', direction: 'descending' },
    },
  })

  return (
    <div className={twMerge(gridStyles(), 'w-full')}>
      <div className='col-span-10'></div>
      <div className='col-span-2 flex flex-row-reverse items-center'>
        <CreatePeerButtonWithModal updated={() => list.reload()} />
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
            <TableColumn key='addlress' minWidth={120} allowsSorting>
              {t('item_address')}
            </TableColumn>
          </TableHeader>
          <TableBody items={list.items}>
            {(peer) => (
              <TableRow key={peer.address}>
                <TableCell>{peer.address}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
