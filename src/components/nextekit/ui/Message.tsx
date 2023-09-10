import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { tv } from 'tailwind-variants'

type Variants = 'normal' | 'info' | 'warn' | 'error'

const Styles = tv({
  base: 'mb-4 flex items-center border-t-4 px-4 py-2',
  variants: {
    type: {
      normal: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
      info: 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400',
      warn: 'border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-gray-800 dark:text-orange-400',
      error: 'border-red-300 bg-red-50 text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400',
    },
  },
  defaultVariants: {
    type: 'normal',
  },
})

const MessageIcon: FC<{ size: number }> = ({ size = 24 }) => (
  <svg
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z'
    />
  </svg>
)

const InfoIcon: FC<{ size: number }> = ({ size = 24 }) => (
  <svg
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
    />
  </svg>
)

const WarnIcon: FC<{ size: number }> = ({ size = 24 }) => (
  <svg
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z'
    />
  </svg>
)

const ErrorIcon: FC<{ size: number }> = ({ size = 24 }) => (
  <svg
    fill='none'
    stroke='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={2}
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z'
    />
  </svg>
)

export const Message: FC<{ children: ReactNode; className?: string; variant?: Variants; iconSize?: number }> = ({
  children,
  className,
  variant = 'normal',
  iconSize = 24,
}) => {
  let icon = <MessageIcon size={iconSize} />
  switch (variant) {
    case 'info':
      icon = <InfoIcon size={iconSize} />
      break
    case 'warn':
      icon = <WarnIcon size={iconSize} />
      break
    case 'error':
      icon = <ErrorIcon size={iconSize} />
      break
  }
  return (
    <div className={twMerge(Styles({ type: variant }), className)}>
      {icon}
      <div className='ml-2'>{children}</div>
    </div>
  )
}
