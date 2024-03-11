'use client'

import { Loading } from '@/components/nextekit/ui/loading'
import { ProgressBar } from '@/components/nextekit/ui/progress'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { formatByte, formatPercent, formatTime } from '@/helpers/format'
import { useLocale } from '@/locale/client'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'

import {
  AppInfo,
  LinodeTransferInfo,
  ServerInfo,
  TopPageNotice,
  getAppInfo,
  getLinodeTransferInfo,
  getServerInfo,
  getTopPageNotice,
} from './server-actions'

export const AppInfoViewClient: FC = () => {
  const { t } = useLocale()
  const [info, setInfo] = useState<AppInfo>()

  useEffect(() => {
    parseAction(getAppInfo()).then((res) => setInfo(res))
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
    parseAction(getServerInfo()).then((res) => setInfo(res))
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

export const TopPageNoticeViewClient: FC = () => {
  const { t, lvt } = useLocale()
  const [info, setInfo] = useState<TopPageNotice>()

  useEffect(() => {
    parseAction(getTopPageNotice()).then((res) => setInfo(res))
  }, [])

  const notice = info ? lvt(info.topPageNotice) : undefined

  return (
    <div className='col-span-12' hidden={notice === ''}>
      {info ? (
        <Card>
          <CardHeader className='py-2'>
            <span className='font-bold'>{t('item_top_page_notice')}</span>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className='whitespace-pre-wrap'>{notice}</div>
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
    parseAction(getLinodeTransferInfo()).then((res) => setInfo(res))
  }, [])

  return (
    <div className='col-span-12 md:col-span-6' hidden={info === null}>
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
