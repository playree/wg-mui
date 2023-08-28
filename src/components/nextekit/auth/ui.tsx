'use client'

import { IconSvgProps } from '@/types'
import { Link } from '@nextui-org/link'
import { signOut } from 'next-auth/react'
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const ArrowRightOnRectangleIcon: React.FC<IconSvgProps> = ({ size = 24, strokeWidth = 2, ...props }) => (
  <svg
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    strokeWidth={strokeWidth}
    width={size}
    {...props}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
    />
  </svg>
)

export const SignOutLink: FC<{ children: ReactNode; className?: string; iconSize?: number }> = ({
  children,
  className,
  iconSize,
}) => {
  return (
    <Link className={twMerge('cursor-pointer', className)} aria-label='SignOut' onPress={() => signOut()}>
      <ArrowRightOnRectangleIcon className='mr-1' size={iconSize} />
      {children}
    </Link>
  )
}
