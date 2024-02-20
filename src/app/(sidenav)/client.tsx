'use client'

import { Loading } from '@/components/nextekit/ui/loading'
import { ProgressBar } from '@/components/nextekit/ui/progress'
import { gridStyles } from '@/components/styles'
import { formatByte, formatPercent, formatTime } from '@/helpers/format'
import { useLocale } from '@/locale'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'

import {
  AppInfo,
  LinodeTransferInfo,
  ServerInfo,
  getAppInfo,
  getLinodeTransferInfo,
  getServerInfo,
} from './server-actions'

export const AppInfoViewClient: FC = () => {
  const { t } = useLocale()
  const [info, setInfo] = useState<AppInfo>()

  useEffect(() => {
    getAppInfo().then((info) => setInfo(info))
  }, [])

  return (
    <div className='col-span-12 md:col-span-6'>
      {info ? (
        <Card>
          <CardHeader className='py-2'>
            <span className='font-bold'>{t('item_app_info')}</span>
          </CardHeader>
          <Divider />
          <CardBody className={gridStyles()}>
            <div className='col-span-4 text-sm font-bold'>{t('item_app_version')} :</div>
            <div className='col-span-8'>{info.version}</div>
            <div className='col-span-4 text-sm font-bold'>{t('item_app_buildno')} :</div>
            <div className='col-span-8'>{info.buildno}</div>
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
    getServerInfo().then((info) => setInfo(info))
  }, [])

  return (
    <div className='col-span-12 md:col-span-6'>
      {info ? (
        <Card>
          <CardHeader className='py-2'>
            <span className='font-bold'>{t('item_server_info')}</span>
          </CardHeader>
          <Divider />
          <CardBody className={gridStyles()}>
            <div className='col-span-4 text-sm font-bold'>{t('item_free_memory')} :</div>
            <div className='col-span-8'>
              <ProgressBar progress={formatPercent(info.memory.free, info.memory.total)}>
                {formatByte(info.memory.free)} / {formatByte(info.memory.total)}
              </ProgressBar>
            </div>

            <div className='col-span-4 text-sm font-bold'>{t('item_uptime')} :</div>
            <div className='col-span-8'>{formatTime(info.uptime)}</div>
          </CardBody>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export const LinodeTransferInfoViewClient: FC = () => {
  const { t } = useLocale()
  const [info, setInfo] = useState<LinodeTransferInfo>()

  useEffect(() => {
    // getLinodeTransferInfo().then((info) => setInfo(info))
    // @todo テスト用ダミー
    setInfo({
      used: 1200109071,
      quota: 4662,
      billable: 0,
      total: 4662 * Math.pow(1024, 3),
    })
  }, [])

  return (
    <div className='col-span-12 md:col-span-6'>
      {info ? (
        <Card>
          <CardHeader className='py-2'>
            <span className='font-bold'>{t('item_transfer_info')}</span>
          </CardHeader>
          <Divider />
          <CardBody className={gridStyles()}>
            <div className='col-span-4 text-sm font-bold'>{t('item_transfer_pool_usage')} :</div>
            <div className='col-span-8'>
              <ProgressBar progress={formatPercent(info.used, info.total)}>
                {formatByte(info.used)} / {info.quota}GiB
              </ProgressBar>
            </div>

            <div className='col-span-4 text-sm font-bold'>{t('item_transfer_billable')} :</div>
            <div className='col-span-8'>{info.billable}GiB</div>
          </CardBody>
        </Card>
      ) : (
        <Loading />
      )}
    </div>
  )
}
