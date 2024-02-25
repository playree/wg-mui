'use client'

import { ArrowPathIcon, CheckCircleIcon, PlayCircleIcon, StopCircleIcon, XCircleIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { Divider, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { SystemInfo, disableWgAutoStart, ebableWgAutoStart, organizePeers, startWg, stopWg } from './server-actions'

export const Title: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_settings')}</span>
}

export const SystemInfoClient: FC<{
  info: SystemInfo
}> = ({ info }) => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  const [isLoadingWgStart, setLoadingWgStart] = useState(false)
  const [isLoadingWgAutoStartEnable, setLoadingWgAutoStartEnable] = useState(false)
  const [isLoadingWgReboot, setLoadingWgReboot] = useState(false)

  return (
    <>
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
          <TableRow>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell>
              <div hidden={!info.wgVersion} className={twMerge(gridStyles())}>
                <div className='col-span-6'>
                  <OnOffChip
                    isEnable={info.isWgStarted}
                    messageOn={t('item_starting')}
                    messageOff={t('item_stopped')}
                  />
                </div>
                <div className='col-span-6 flex items-center'>
                  <Divider orientation='vertical' className='mr-2' />
                  {info.isWgStarted ? (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      color='danger'
                      isSmart
                      startContent={isLoadingWgStart ? undefined : <StopCircleIcon />}
                      isLoading={isLoadingWgStart}
                      onPress={async () => {
                        console.debug('WireGuard Stop:')
                        if (window.confirm(t('msg_wg_stop_confirm'))) {
                          setLoadingWgStart(true)
                          await parseAction(stopWg())
                          await intervalOperation()
                          setLoadingWgStart(false)
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
                      startContent={isLoadingWgStart ? undefined : <PlayCircleIcon />}
                      isLoading={isLoadingWgStart}
                      onPress={async () => {
                        console.debug('WireGuard Start:')
                        setLoadingWgStart(true)
                        await parseAction(startWg())
                        await intervalOperation()
                        const organizeList = await parseAction(organizePeers())
                        console.debug('organizeList:', organizeList)
                        setLoadingWgStart(false)
                        refresh()
                      }}
                    >
                      {t('item_start')}
                    </ExButton>
                  )}
                  <ExButton
                    className='ml-2'
                    variant='solid'
                    color='warning'
                    isSmart
                    isDisabled={!info.isWgStarted}
                    startContent={isLoadingWgReboot ? undefined : <ArrowPathIcon />}
                    isLoading={isLoadingWgReboot}
                    onPress={async () => {
                      console.debug('WireGuard Reboot:')
                      if (window.confirm(t('msg_wg_restart_confirm'))) {
                        setLoadingWgReboot(true)
                        await parseAction(stopWg())
                        await parseAction(startWg())
                        await intervalOperation()
                        const organizeList = await parseAction(organizePeers())
                        console.debug('organizeList:', organizeList)
                        setLoadingWgReboot(false)
                        refresh()
                      }
                    }}
                  >
                    {t('item_restart')}
                  </ExButton>
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className='border-b-1 border-gray-500'>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell>
              <div hidden={!info.wgVersion} className={twMerge(gridStyles())}>
                <div className='col-span-6'>
                  <OnOffChip
                    isEnable={info.isWgAutoStartEnabled}
                    messageOn={t('item_autostart_on')}
                    messageOff={t('item_autostart_off')}
                  />
                </div>
                <div className='col-span-6 flex items-center'>
                  <Divider orientation='vertical' className='mr-2' />
                  {info.isWgAutoStartEnabled ? (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      color='danger'
                      isSmart
                      startContent={isLoadingWgAutoStartEnable ? undefined : <XCircleIcon />}
                      isLoading={isLoadingWgAutoStartEnable}
                      onPress={async () => {
                        console.debug('WireGuard AutoStart Disable:')
                        if (window.confirm(t('msg_wg_autostart_disable_confirm'))) {
                          setLoadingWgAutoStartEnable(true)
                          await parseAction(disableWgAutoStart())
                          await intervalOperation()
                          setLoadingWgAutoStartEnable(false)
                          refresh()
                        }
                      }}
                    >
                      {t('item_disable')}
                    </ExButton>
                  ) : (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      isSmart
                      startContent={isLoadingWgAutoStartEnable ? undefined : <CheckCircleIcon />}
                      isLoading={isLoadingWgAutoStartEnable}
                      onPress={async () => {
                        console.debug('WireGuard AutoStart Enable:')
                        setLoadingWgAutoStartEnable(true)
                        await parseAction(ebableWgAutoStart())
                        await intervalOperation()
                        setLoadingWgAutoStartEnable(false)
                        refresh()
                      }}
                    >
                      {t('item_enable')}
                    </ExButton>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>IP Forward</TableCell>
            <TableCell>{info.ipForward || ''}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  )
}
