import { gridStyles } from '@/components/styles'
import { Metadata } from 'next'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import {
  AppInfoViewClient,
  LinodeTransferInfoViewClient,
  ServerInfoViewClient,
  TopPageNoticeViewClient,
} from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Home',
}

const HomePage: FC = () => {
  return (
    <div className={twMerge(gridStyles(), 'mt-4 w-full')}>
      <TopPageNoticeViewClient />
      <AppInfoViewClient />
      <ServerInfoViewClient />
      <LinodeTransferInfoViewClient />
    </div>
  )
}
export default HomePage
