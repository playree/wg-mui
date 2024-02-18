import { CloudIcon } from '@/components/icons'
import { Loading } from '@/components/nextekit/ui/loading'
import { Metadata } from 'next'
import { FC, Suspense } from 'react'

import { PeerTitle, PeerViewClient, RefreshButton } from './client'
import { getUserPeerList } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Peer',
}

const PeerView: FC = async () => {
  const peerList = await getUserPeerList()
  return <PeerViewClient peerList={peerList} />
}

const PeerPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <CloudIcon className='mr-2' />
        <PeerTitle />
        <div className='flex flex-auto flex-row-reverse'>
          <RefreshButton />
        </div>
      </div>

      <div className='flex min-h-[200px] w-full'>
        <Suspense fallback={<Loading />}>
          <PeerView />
        </Suspense>
      </div>
    </div>
  )
}
export default PeerPage
