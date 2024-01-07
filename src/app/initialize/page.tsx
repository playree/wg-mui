import { RedirectComponent } from '@/components/nextekit/ui/redirect'
import { getWgConf } from '@/helpers/wgconf'
import { Metadata } from 'next'
import { FC, use } from 'react'

import { InitializeSettings } from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Initialize',
}

const InitializePage: FC = () => {
  const wgConf = use(getWgConf())

  return wgConf ? <RedirectComponent redirectUrl='/' /> : <InitializeSettings />
}
export default InitializePage
