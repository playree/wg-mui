import { RedirectComponent } from '@/components/nextekit/ui/redirect'
import { SideNavbar } from '@/components/nextekit/ui/side-navbar'
import { getWgMgr } from '@/helpers/wgmgr'
import { FC, ReactNode } from 'react'

import { Menu, getMenu } from './menu'

const SideNavLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const wgMgr = await getWgMgr()
  if (!wgMgr) {
    return <RedirectComponent redirectUrl='/initialize' />
  }

  return (
    <SideNavbar menu={<Menu />} getMenu={getMenu} className='bg-white dark:bg-black'>
      <div className='mx-auto max-w-3xl'>{children}</div>
    </SideNavbar>
  )
}
export default SideNavLayout
