import { ComputerDesktopIcon } from '@/components/icons'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC, use } from 'react'

import { PeerListClient, PeerManagementTitle } from './client'
import { getUser } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Peer',
}

const PeerPage: FC<{ params: { userId: string } }> = ({ params: { userId } }) => {
  const user = use(getUser(userId))
  if (!user) {
    return notFound()
  }

  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <ComputerDesktopIcon className='mr-2' />
        <PeerManagementTitle user={user} />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <PeerListClient user={user} />
      </div>
    </div>
  )
}
export default PeerPage
