import { Cog6ToothIcon } from '@/components/icons'
import { Loading } from '@/components/nextekit/ui/loading'
import { Address4 } from 'ip-address'
import { Metadata } from 'next'
import { FC, Suspense, use } from 'react'

import { SettingsTitle, StatusViewClient } from './client'
import { getIpForward, getWgVersion } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Settings',
}

const StatusView: FC = () => {
  const wg = use(getWgVersion())
  const ipf = use(getIpForward())
  return (
    <StatusViewClient
      view={{
        wg,
        ipf,
      }}
    />
  )
}

const SettingsPage: FC = () => {
  const ip4 = new Address4('192.16.123.111/24')
  console.debug('ip4:', ip4)
  console.debug('startAddress:', ip4.startAddress())
  console.debug('endAddress:', ip4.endAddress())

  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <SettingsTitle />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <Suspense fallback={<Loading />}>
          <StatusView />
        </Suspense>
      </div>
    </div>
  )
}
export default SettingsPage
