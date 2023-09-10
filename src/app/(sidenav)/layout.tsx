import { SideNavbar } from '@/components/nextekit/ui/SideNavbar'
import { FC, ReactNode } from 'react'

import { Menu } from './menu'

const SideNavLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <SideNavbar menu={<Menu />} className='bg-white dark:bg-black'>
      {children}
    </SideNavbar>
  )
}
export default SideNavLayout
