'use client'

import { IconSvgProps } from '@/types'
import { FC, ReactNode, useState } from 'react'
import { twMerge } from 'tailwind-merge'

const Bars3BottomLeftIcon: FC<IconSvgProps> = ({ size = 24, width, height, ...props }) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    height={size || height}
    width={size || width}
    {...props}
  >
    <path
      clipRule='evenodd'
      fillRule='evenodd'
      d='M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75
          0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75H12a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z'
    />
  </svg>
)

export const SideNavbar: FC<{
  children: ReactNode
  menu?: ReactNode
  getMenu?: (closeMenu?: () => void) => ReactNode
  className?: string
}> = ({ children, menu, getMenu, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const closeMenu = () => {
    setIsOpen(false)
  }
  return (
    <>
      <button
        className={twMerge(
          'fixed z-40 mt-2 ml-3 rounded-lg bg-gray-200 p-2 text-sm text-gray-500',
          'opacity-50 hover:bg-gray-300 focus:ring-2 focus:ring-gray-200 focus:outline-hidden',
          'lg:hidden dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600',
        )}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        <Bars3BottomLeftIcon size={18} />
      </button>

      <nav // サイドメニュー
        id='side-menu'
        className={twMerge(
          'fixed top-0 left-0 z-40 h-screen w-64 -translate-x-full transition-transform',
          isOpen ? 'transform-none' : 'lg:translate-x-0',
        )}
      >
        <div className={twMerge('h-full overflow-y-auto bg-gray-100 px-3 py-4 dark:bg-gray-900', className)}>
          {getMenu
            ? getMenu(() => {
                setTimeout(closeMenu, 200)
              })
            : menu}
        </div>
      </nav>
      <div
        className={twMerge('bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-30 bg-gray-900', isOpen ? '' : 'hidden')}
        onClick={closeMenu}
      ></div>

      <div // メインコンテンツ
        id='side-main'
        className='p-4 lg:ml-64'
      >
        {children}
      </div>
    </>
  )
}
