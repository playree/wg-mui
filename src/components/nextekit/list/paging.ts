import { useAsyncList } from '@react-stately/data'
import { useMemo, useState } from 'react'

import { sortFunction } from './sort'

export const usePageingList = <T extends Record<string, unknown>[]>({ load }: { load: () => Promise<T> }) => {
  const rowsPerPage = 3
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const list = useAsyncList({
    async load() {
      const items = await load()
      setTotal(Math.ceil(items.length / rowsPerPage))
      return {
        items,
      }
    },
    sort: sortFunction,
  })
  const items = useMemo(() => {
    console.debug('items update page:', page)
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage
    return list.items.slice(start, end) as T
  }, [list.items, page])

  return {
    items,
    total,
    page,
    sortDescriptor: list.sortDescriptor,
    onSortChange: list.sort,
    onPageChange: (page: number) => {
      console.debug('onPageChange:', page)
      setPage(page)
    },
    reload: list.reload,
  }
}
