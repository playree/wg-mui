import { RedirectComponent } from '@/components/nextekit/ui/redirect'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { FC } from 'react'

import { InitializeAdmin, InitializeSettings } from './client'
import { existAdminUser, isInitialized } from './server-actions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Initialize',
}

const InitializePage: FC = async () => {
  if (await parseAction(isInitialized())) {
    return <RedirectComponent redirectUrl='/' />
  }

  const hostname = new URL(process.env.NEXTAUTH_URL || 'http://localhost').hostname
  const exist = await parseAction(existAdminUser())
  return exist ? <InitializeSettings hostname={hostname} /> : <InitializeAdmin />
}
export default InitializePage
