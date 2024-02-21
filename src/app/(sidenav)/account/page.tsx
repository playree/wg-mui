import { CloudIcon } from '@/components/icons'
import { Loading } from '@/components/nextekit/ui/loading'
import { Metadata } from 'next'
import { FC, Suspense } from 'react'

import { AccountViewClient, Title } from './client'
import { getAccount } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Account',
}

const AccountView: FC = async () => {
  const account = await getAccount()
  return <AccountViewClient account={account} />
}

const PeerPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <CloudIcon className='mr-2' />
        <Title />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <Suspense fallback={<Loading />}>
          <AccountView />
        </Suspense>
      </div>
    </div>
  )
}
export default PeerPage
