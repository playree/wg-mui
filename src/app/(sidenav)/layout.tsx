import { SideNavbar } from '@/components/nextekit/ui/SideNavbar'
import { FC, ReactNode } from 'react'

import { Menu } from './menu'

const SideNavLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SideNavbar menu={<Menu />} className='bg-white dark:bg-black'>
      <div className='mx-auto max-w-3xl'>{children}</div>
    </SideNavbar>
  )
}
export default SideNavLayout
