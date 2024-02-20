'use client'

import { Loading } from '@/components/nextekit/ui/loading'
import { gridStyles } from '@/components/styles'
import { useLocale } from '@/locale'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'

import { type AppInfo, getAppInfo } from './server-actions'

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
