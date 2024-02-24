import { ComputerDesktopIcon } from '@/components/icons'
import { Metadata } from 'next'
import { FC } from 'react'

import { PeerAllListClient, Title } from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'All Peer',
}

const PeerListPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <ComputerDesktopIcon className='mr-2' />
        <Title />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <PeerAllListClient />
      </div>
    </div>
  )
}
export default PeerListPage
