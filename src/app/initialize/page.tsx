import { RedirectComponent } from '@/components/nextekit/ui/redirect'
import { getSessionUser } from '@/config/auth-options'
import { parseAction } from '@/helpers/action'
import { Metadata } from 'next'
import { FC } from 'react'

import { InitializeAdmin, InitializeSettings, SigninRedirect } from './client'
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
  if (exist) {
    const user = await getSessionUser()
    if (user?.isAdmin) {
      return <InitializeSettings hostname={hostname} />
    }
    return <SigninRedirect />
  }
  return <InitializeAdmin />
}
export default InitializePage
