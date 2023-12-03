import { useAsyncList } from '@react-stately/data'
import { useMemo, useState } from 'react'

import { sortFunction } from './sort'

export const usePageingList = <T extends Record<string, unknown>[], F extends Record<string, string>>({
  load,
  filter,
}: {
  load: () => Promise<T>
  filter?: {
    init: F
    proc: (item: T[0], filters: F) => boolean
  }
}) => {
  const rowsPerPage = 3
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const list = useAsyncList({
    async load() {
      const items = await load()
      return {
        items,
      }
    },
    sort: sortFunction,
  })

  const [filters, setFilters] = useState(filter?.init)
  const [filterState] = useState(filter)

  const items = useMemo(() => {
    console.debug('items update page:', page)

    // フィルタ
    const tmpList = filterState && filters ? list.items.filter((item) => filterState.proc(item, filters)) : list.items

    // ページング
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    setTotal(Math.ceil(tmpList.length / rowsPerPage))
    return tmpList.slice(start, end) as T
  }, [filterState, filters, list.items, page])

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
    setFilters,
  }
}
