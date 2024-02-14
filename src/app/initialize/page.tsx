import { RedirectComponent } from '@/components/nextekit/ui/redirect'
import { getWgMgr } from '@/helpers/wgmgr'
import { Metadata } from 'next'
import { FC, use } from 'react'

import { InitializeSettings } from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Initialize',
}

const InitializePage: FC = () => {
  const wgMgr = use(getWgMgr())
  const hostname = new URL(process.env.NEXTAUTH_URL || 'http://localhost').hostname

  return wgMgr ? <RedirectComponent redirectUrl='/' /> : <InitializeSettings hostname={hostname} />
}
export default InitializePage
