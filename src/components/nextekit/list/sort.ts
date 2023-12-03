import { SortDescriptor } from '@nextui-org/react'

export const sortFunction = async <T extends Record<string, unknown>>({
  items,
  sortDescriptor: { column, direction },
}: {
  items: T[]
  sortDescriptor: SortDescriptor
}) => {
  return {
    items: items.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      let cmp = 0
      if (column) {
        const acol = a[String(column)]
        const bcol = b[String(column)]

        // string
        if (typeof acol === 'string' && typeof bcol === 'string') {
          cmp = acol < bcol ? -1 : 1
        }
        // number
        if (typeof acol === 'number' && typeof bcol === 'number') {
          cmp = acol < bcol ? -1 : 1
        }
        // boolean
        if (typeof acol === 'boolean' && typeof bcol === 'boolean') {
          cmp = acol < bcol ? -1 : 1
        }
      }

      if (direction === 'descending') {
        cmp *= -1
      }

      return cmp
    }),
  }
}
