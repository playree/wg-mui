'use client'

import { usePageingList } from '@/components/nextekit/list/paging'
import { gridStyles } from '@/components/styles'
import { useLocale } from '@/locale'
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { getPeerAllList } from './server-actions'

export const PeerManagementTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('item_peer_management')}</span>
}

export const PeerAllListClient: FC = () => {
  const { t } = useLocale()

  const list = usePageingList({
    load: () => getPeerAllList(),
    sort: {
      init: { column: 'updatedAt', direction: 'descending' },
    },
  })

  return (
    <>
      <div className={twMerge(gridStyles(), 'w-full')}>
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
              <TableColumn key='remarks' allowsSorting>
                {t('item_remarks')}
              </TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(peer) => (
                <TableRow key={peer.ip}>
                  <TableCell>{peer.ip}</TableCell>
                  <TableCell>{peer.remarks}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
