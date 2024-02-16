import { tv } from 'tailwind-variants'

export const iconSizes = {
  sm: 16,
  md: 20,
  lg: 24,
}

export const textStyles = tv({
  base: 'text-black dark:text-white',
  variants: {
    color: {
      light: 'text-gray-600 dark:text-gray-400',
    },
  },
})

export const gridStyles = tv({
  base: 'grid grid-cols-12 gap-2',
})
