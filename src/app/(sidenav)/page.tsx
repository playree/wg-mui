import { gridStyles } from '@/components/styles'
import { Metadata } from 'next'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

import { AppInfoViewClient } from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Home',
}

const HomePage: FC = () => {
  return (
    <div className={twMerge(gridStyles(), 'mt-4 w-full')}>
      <AppInfoViewClient />
    </div>
  )
}
export default HomePage
