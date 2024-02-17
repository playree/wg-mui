import { Input, InputProps } from '@nextui-org/react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

export const InputCtrl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  type = 'text',
  variant = 'bordered',
  ...props
}: InputProps & {
  control?: Control<TFieldValues>
  name: TName
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Input
          {...props}
          type={type}
          variant={variant}
          onChange={type === 'number' ? (e) => onChange(Number(e.target.value)) : onChange}
          value={value}
        />
      )}
    />
  )
}
