import { ChangeEvent } from 'react'

export const requireSelect = (onChange: (event: ChangeEvent<HTMLSelectElement>) => void) => {
  return (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) {
      onChange(event)
    }
  }
}
