'use client'

import { useLocale } from '@/locale'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { FC } from 'react'

export const SettingsTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_settings')}</span>
}

export const StatusViewClient: FC<{
  view: {
    wg?: string
    ipf?: string
  }
}> = ({ view }) => {
  const { t } = useLocale()
  return (
    <Table hideHeader>
      <TableHeader>
        <TableColumn>item</TableColumn>
        <TableColumn>status</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>WireGuard</TableCell>
          <TableCell>{view.wg || t('msg_not_installed')}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>IP Forward</TableCell>
          <TableCell>{view.ipf || ''}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
