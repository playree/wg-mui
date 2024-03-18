import { Cog6ToothIcon } from '@/components/icons'
import { Loading } from '@/components/nextekit/ui/loading'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { FC, Suspense } from 'react'

import { SettingsClient, SystemInfoClient, Title } from './client'
import { getSettings, getSystemInfo } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Settings',
}

const StatusView: FC = async () => {
  const info = await parseAction(getSystemInfo())
  return <SystemInfoClient info={info} />
}

const SettingsView: FC = async () => {
  const settings = await parseAction(getSettings())
  return <SettingsClient settings={settings} />
}

const SettingsPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <Title />
      </div>

      <div className='flex min-h-[200px] w-full flex-wrap'>
        <Suspense fallback={<Loading />}>
          <StatusView />
        </Suspense>
      </div>
      <div className='flex min-h-[200px] w-full flex-wrap'>
        <Suspense fallback={<Loading />}>
          <SettingsView />
        </Suspense>
      </div>
    </div>
  )
}
export default SettingsPage
