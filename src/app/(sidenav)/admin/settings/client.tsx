'use client'

import { PlayCircleIcon, StopCircleIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'

import { SystemInfo, startWg, stopWg } from './server-actions'

export const SettingsTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_settings')}</span>
}

export const SystemInfoClient: FC<{
  info: SystemInfo
}> = ({ info }) => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  const [isLoadingStartStop, setLoadingStartStop] = useState(false)

  return (
    <Table aria-label='system info' hideHeader>
      <TableHeader>
        <TableColumn>item</TableColumn>
        <TableColumn>status</TableColumn>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>WireGuard</TableCell>
          <TableCell>{info.wgVersion || t('msg_not_installed')}</TableCell>
        </TableRow>
        <TableRow className='border-b-1 border-gray-500'>
          <TableCell>
            <div></div>
          </TableCell>
          <TableCell>
            <div hidden={!info.wgVersion} className=' flex items-center'>
              <OnOffChip isEnable={info.isWgStarted} messageOn={t('item_starting')} messageOff={t('item_stopped')} />
              {info.isWgStarted ? (
                <ExButton
                  className='ml-2'
                  variant='solid'
                  isSmart
                  startContent={isLoadingStartStop ? undefined : <StopCircleIcon />}
                  isLoading={isLoadingStartStop}
                  onPress={async () => {
                    console.debug('WireGuard Stop:')
                    if (window.confirm(t('msg_wg_stop_confirm'))) {
                      setLoadingStartStop(true)
                      await stopWg()
                      await intervalOperation()
                      setLoadingStartStop(false)
                      refresh()
                    }
                  }}
                >
                  {t('item_stop')}
                </ExButton>
              ) : (
                <ExButton
                  className='ml-2'
                  variant='solid'
                  isSmart
                  startContent={isLoadingStartStop ? undefined : <PlayCircleIcon />}
                  isLoading={isLoadingStartStop}
                  onPress={async () => {
                    console.debug('WireGuard Start:')
                    setLoadingStartStop(true)
                    await startWg()
                    await intervalOperation()
                    setLoadingStartStop(false)
                    refresh()
                  }}
                >
                  {t('item_start')}
                </ExButton>
              )}
            </div>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>IP Forward</TableCell>
          <TableCell>{info.ipForward || ''}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
