import { SortDescriptor } from '@heroui/react'
import { AsyncListLoadFunction, useAsyncList } from '@react-stately/data'
import { useEffect, useMemo, useState } from 'react'

import { sortFunction } from './sort'

export const usePageingList = <T extends Record<string, unknown>[], F extends Record<string, string>>({
  load,
  filter,
  sort,
  rowsPerPage = 10,
}: {
  load: () => Promise<T>
  filter?: {
    init: F
    proc: (item: T[0], filters: F) => boolean
  }
  sort?: {
    init?: SortDescriptor
    proc?: AsyncListLoadFunction<Record<string, unknown>, string>
  }
  rowsPerPage?: number
}) => {
  const [page, setPage] = useState(1)
  const [listLen, setListLen] = useState(0)
  const sortFunc = sort?.proc || sortFunction

  const list = useAsyncList({
    async load({ sortDescriptor, selectedKeys, signal }) {
      const items = await load()
      console.debug('sortDescriptor:', sortDescriptor)
      if (sortDescriptor) {
        return sortFunc({ items, sortDescriptor, selectedKeys, signal })
      }
      return { items }
    },
    sort: sortFunc,
    initialSortDescriptor: sort?.init,
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

    setListLen(tmpList.length)
    return tmpList.slice(start, end) as T
  }, [filterState, filters, list.items, page, rowsPerPage])

  const total = useMemo(() => {
    return Math.ceil(listLen / rowsPerPage) || 1
  }, [listLen, rowsPerPage])

  useEffect(() => {
    setPage(1)
  }, [filters])

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
    setFilter: (filter: Partial<F>) => {
      if (filters) {
        setFilters({
          ...filters,
          ...filter,
        })
      }
    },
  }
}
