'use client'

import { Loading } from '@/components/nextekit/ui/loading'
import { ProgressBar } from '@/components/nextekit/ui/progress'
import { gridStyles } from '@/components/styles'
import { formatByte, formatPercent, formatTime } from '@/helpers/format'
import { useLocale } from '@/locale'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'

import { type AppInfo, ServerInfo, getAppInfo, getServerInfo } from './server-actions'

export const AppInfoViewClient: FC = () => {
  const { t } = useLocale()
  const [info, setInfo] = useState<AppInfo>()

  useEffect(() => {
    getAppInfo().then((info) => {
      setInfo(info)
    })
  }, [])

  return (
    <div className='col-span-12 md:col-span-6'>
      {info ? (
        <Card>
          <CardHeader className='py-2'>{t('item_app_info')}</CardHeader>
          <Divider />
          <CardBody className={gridStyles()}>
            <div className='col-span-5'>{t('item_app_version')} :</div>
            <div className='col-span-7'>{info.version}</div>
            <div className='col-span-5'>{t('item_app_buildno')} :</div>
            <div className='col-span-7'>{info.buildno}</div>
          </CardBody>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export const ServerInfoViewClient: FC = () => {
  const { t } = useLocale()
  const [info, setInfo] = useState<ServerInfo>()

  useEffect(() => {
    getServerInfo().then((info) => {
      setInfo(info)
    })
  }, [])

  return (
    <div className='col-span-12 md:col-span-6'>
      {info ? (
        <Card>
          <CardHeader className='py-2'>{t('item_server_info')}</CardHeader>
          <Divider />
          <CardBody className={gridStyles()}>
            <div className='col-span-5'>{t('item_free_memory')} :</div>
            <div className='col-span-7'>
              <ProgressBar progress={formatPercent(info.memory.free, info.memory.total)}>
                {formatByte(info.memory.free)} / {formatByte(info.memory.total)}
              </ProgressBar>
            </div>

            <div className='col-span-5'>{t('item_uptime')} :</div>
            <div className='col-span-7'>{formatTime(info.uptime)}</div>
          </CardBody>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  )
}
