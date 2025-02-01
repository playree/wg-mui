import { SortDescriptor } from "@heroui/react"
import { AsyncListLoadFunction } from '@react-stately/data'

export const sortFunction: AsyncListLoadFunction<Record<string, unknown>, string> = async <
  T extends Record<string, unknown>,
>({
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
        else if (typeof acol === 'number' && typeof bcol === 'number') {
          cmp = acol < bcol ? -1 : 1
        }
        // boolean
        else if (typeof acol === 'boolean' && typeof bcol === 'boolean') {
          cmp = acol < bcol ? -1 : 1
        }
        // Date
        else if (acol instanceof Date && bcol instanceof Date) {
          cmp = acol < bcol ? -1 : 1
        }
        //
        else if (acol === undefined || bcol === undefined) {
          cmp = !acol && bcol ? -1 : 1
        }
      }

      if (direction === 'descending') {
        cmp *= -1
      }

      return cmp
    }),
  }
}
