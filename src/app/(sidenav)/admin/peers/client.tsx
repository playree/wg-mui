'use client'

import { ArrowPathIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { dayformat } from '@/helpers/day'
import { useLocale } from '@/locale'
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { getPeerAllList, reloadPeerStatus } from './server-actions'

export const PeerManagementTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_peers')}</span>
}

export const RefreshButton: FC = () => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  return (
    <ExButton
      isIconOnly
      isSmart
      tooltip={t('item_refresh')}
      onPress={async () => {
        await reloadPeerStatus()
        refresh()
      }}
    >
      <ArrowPathIcon />
    </ExButton>
  )
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
        <div className='col-span-12 flex flex-auto flex-row-reverse'>
          <ExButton
            isIconOnly
            isSmart
            tooltip={t('item_refresh')}
            onPress={async () => {
              await reloadPeerStatus()
              list.reload()
            }}
          >
            <ArrowPathIcon />
          </ExButton>
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
              <TableColumn key='receive' minWidth={80} allowsSorting>
                {t('item_receive')}
              </TableColumn>
              <TableColumn key='send' minWidth={80} allowsSorting>
                {t('item_send')}
              </TableColumn>
              <TableColumn key='remarks'>{t('item_remarks')}</TableColumn>
              <TableColumn key='updatedAt' allowsSorting>
                {t('item_updated_at')}
              </TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(peer) => (
                <TableRow key={peer.ip}>
                  <TableCell>{peer.ip}</TableCell>
                  <TableCell>{peer.receiveText}</TableCell>
                  <TableCell>{peer.sendText}</TableCell>
                  <TableCell>{peer.remarks}</TableCell>
                  <TableCell>
                    <div className='text-xs'>{dayformat(peer.updatedAt, 'jp-simple')}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}
