import { ComputerDesktopIcon } from '@/components/icons'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { FC } from 'react'

import { PeerListClient, Title } from './client'
import { getUser } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Peer Management',
}

const PeerManagementPage: FC<{ params: Promise<{ userId: string }> }> = async (props) => {
  const params = await props.params
  const { userId } = params

  const user = await parseAction(getUser({ id: userId }))
  if (!user) {
    return notFound()
  }

  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <ComputerDesktopIcon className='mr-2' />
        <Title user={user} />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <PeerListClient user={user} />
      </div>
    </div>
  )
}
export default PeerManagementPage
