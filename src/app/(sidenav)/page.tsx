import { gridStyles } from '@/components/styles'
import { getSessionUser } from '@/config/auth-options'
import { getEnabledReleaseNote } from '@/helpers/key-value'
import { Metadata } from 'next'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import {
  AppInfoViewClient,
  LinodeTransferInfoViewClient,
  ReleaseNoteViewClient,
  ServerInfoViewClient,
  TopPageNoticeViewClient,
} from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Home',
}

const HomePage: FC = async () => {
  const user = await getSessionUser()
  const enabledReleaseNote = await getEnabledReleaseNote()
  const isEnabledReleaseNote =
    enabledReleaseNote === 'enabled_all' || (enabledReleaseNote === 'enabled_admin' && user?.isAdmin)

  return isEnabledReleaseNote ? (
    <div className={twMerge(gridStyles(), 'mt-4 w-full')}>
      <div className='col-span-12'>
        <TopPageNoticeViewClient />
      </div>
      <div className='col-span-12 grid grid-cols-12 gap-y-2 md:col-span-6'>
        <div className='col-span-12'>
          <AppInfoViewClient />
        </div>
        <div className='col-span-12'>
          <ServerInfoViewClient />
        </div>
        <div className='col-span-12'>
          <LinodeTransferInfoViewClient />
        </div>
      </div>
      <div className='col-span-12 md:col-span-6'>
        <ReleaseNoteViewClient />
      </div>
    </div>
  ) : (
    <div className={twMerge(gridStyles(), 'mt-4 w-full')}>
      <div className='col-span-12'>
        <TopPageNoticeViewClient />
      </div>
      <div className='col-span-12 md:col-span-6'>
        <AppInfoViewClient />
      </div>
      <div className='col-span-12 md:col-span-6'>
        <ServerInfoViewClient />
      </div>
      <div className='col-span-12 md:col-span-6'>
        <LinodeTransferInfoViewClient />
      </div>
    </div>
  )
}
export default HomePage
