import { Spinner } from '@nextui-org/spinner'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export const Loading: FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={twMerge('m-auto', className)}>
      <Spinner label='Loading...' color='primary' />
    </div>
  )
}
