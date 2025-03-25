import { Spinner } from '@heroui/spinner'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export const Loading: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge('flex w-full', className)}>
      <Spinner label='Loading...' color='primary' className='m-auto' />
    </div>
  )
}
