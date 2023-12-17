'use client'

import { PencilSquareIcon, TrashIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import type { TypeLabel } from '@/helpers/schema'
import { useLocale } from '@/locale'
import {
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { CreateLabelButtonWithModal, DeleteLabelModal, EditLabelModal } from './edit'
import { getLabelList } from './server-actions'

export const LabelsTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_labels')}</span>
}

export const LabelListClient: FC = () => {
  const { t } = useLocale()

  const list = usePageingList({
    load: () => getLabelList('count'),
    filter: {
      init: { free: '' },
      proc: (item, filters) => {
        return filters.free ? item.name.indexOf(filters.free) > -1 : true
      },
    },
  })
  const [filterText, setFilterText] = useState('')

  const updateModal = useDisclosure()
  const openUpdateModal = updateModal.onOpen
  const [targetUpdate, setTargetUpdate] = useState<TypeLabel>()

  const [targetDelete, setTargetDelete] = useState<TypeLabel>()
  const deleteModal = useDisclosure()
  const openDeleteModal = deleteModal.onOpen

  useEffect(() => {
    console.debug('targetUpdate:', targetUpdate)
    if (targetUpdate) {
      openUpdateModal()
    }
  }, [openUpdateModal, targetUpdate])

  useEffect(() => {
    console.debug('targetDelete:', targetDelete)
    if (targetDelete) {
      openDeleteModal()
    }
  }, [openDeleteModal, targetDelete])

  return (
    <>
      <div className={twMerge(gridStyles(), 'w-full')}>
        <div className='col-span-6'>
          <Input
            type='text'
            value={filterText}
            label={t('item_label_name')}
            placeholder={t('msg_enter_search_word')}
            onChange={(el) => {
              setFilterText(el.target.value)
              list.setFilters({ free: el.target.value })
            }}
          />
        </div>
        <div className='col-span-5'></div>
        <div className='col-span-1 flex items-center'>
          <CreateLabelButtonWithModal updated={() => list.reload()} />
        </div>
        <div className='col-span-12'>
          <Table
            aria-label='label list'
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.onSortChange}
            bottomContent={
              <div className='flex w-full justify-center'>
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color='secondary'
                  page={list.page}
                  total={list.total}
                  onChange={list.onPageChange}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn key='name' allowsSorting>
                {t('item_label_name')}
              </TableColumn>
              <TableColumn>{t('item_explanation')}</TableColumn>
              <TableColumn>{t('item_action')}</TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(label) => (
                <TableRow key={label.id}>
                  <TableCell>{label.name}</TableCell>
                  <TableCell>{label.explanation}</TableCell>
                  <TableCell>
                    <ExButton
                      isIconOnly
                      isSmart
                      color='primary'
                      tooltip='編集'
                      onPress={() => {
                        setTargetUpdate(label)
                      }}
                    >
                      <PencilSquareIcon />
                    </ExButton>
                    <ExButton
                      isIconOnly
                      isSmart
                      color='danger'
                      tooltip='削除'
                      onPress={() => {
                        setTargetDelete(label)
                      }}
                    >
                      <TrashIcon />
                    </ExButton>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <EditLabelModal
        size='xl'
        isOpen={updateModal.isOpen}
        onOpenChange={updateModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetUpdate}
        updated={() => {
          list.reload()
        }}
        onClose={() => setTargetUpdate(undefined)}
      />
      <DeleteLabelModal
        size='xl'
        isOpen={deleteModal.isOpen}
        onOpenChange={deleteModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetDelete}
        updated={() => {
          list.reload()
        }}
        onClose={() => setTargetDelete(undefined)}
      />
    </>
  )
}
