import { Input, InputProps } from "@heroui/react"
import { ChangeEvent } from 'react'
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form'

export const InputCtrl = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  type = 'text',
  variant = 'bordered',
  onChanged,
  ...props
}: InputProps & {
  control?: Control<TFieldValues>
  name: TName
  onChanged?: (e: ChangeEvent<HTMLInputElement>) => void
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
          onChange={
            type === 'number'
              ? (e) => {
                  if (onChanged) {
                    onChanged(e)
                  }
                  onChange(Number(e.target.value))
                }
              : (e) => {
                  if (onChanged) {
                    onChanged(e)
                  }
                  onChange(e)
                }
          }
          value={value || (type === 'number' ? '0' : '')}
          isInvalid={!!props.errorMessage}
        />
      )}
    />
  )
}
