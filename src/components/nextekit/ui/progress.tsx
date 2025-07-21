import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export const ProgressBar: FC<{
  children?: ReactNode
  progress: number
  className?: string
}> = ({ children, progress, className }) => {
  return (
    <div className='relative w-full rounded-sm bg-neutral-200 dark:bg-neutral-600'>
      <div
        className={twMerge(
          'rounded-sm bg-blue-300 p-1 text-center leading-none text-white dark:bg-blue-700',
          className,
        )}
        style={{ width: `${progress}%` }}
      >
        &nbsp;
      </div>
      <div
        className={twMerge(
          'absolute top-0 w-full p-1 text-center leading-none font-bold text-gray-700 dark:text-white',
          className,
        )}
      >
        {children}
      </div>
    </div>
  )
}
