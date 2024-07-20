import { Progress } from '@nextui-org/react'
import { FC } from 'react'

import { textStyles } from './styles'

const COLOR: ('danger' | 'warning' | 'success' | 'primary')[] = ['danger', 'danger', 'warning', 'success', 'primary']

export const PasswordScore: FC<{
  label: string
  score: number
  isDisabled?: boolean
}> = ({ label, score, isDisabled }) => {
  return (
    <Progress
      radius='sm'
      size='sm'
      maxValue={4}
      label={label}
      value={score}
      classNames={{
        base: 'mx-2 my-1 max-w-sm',
        label: isDisabled ? textStyles({ color: 'light' }) : '',
      }}
      color={COLOR[score]}
      isDisabled={isDisabled}
    />
  )
}
