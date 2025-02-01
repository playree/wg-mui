'use client'

import { useSharedUIContext } from '@/app/context'
import { EllipsisHorizontalIcon, PencilSquareIcon, TrashIcon } from '@/components/icons'
import { usePageingList } from '@/components/nextekit/list/paging'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { dayformat } from '@/helpers/day'
import type { TypeLabel } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react"
import { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { CreateLabelButtonWithModal, UpdateLabelModal } from './edit'
import { deleteLabel, getLabelList } from './server-actions'

export const Title: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_labels')}</span>
}

export const LabelListClient: FC = () => {
  const { t } = useLocale()
  const { confirmModal } = useSharedUIContext()

  const list = usePageingList({
    load: async () => parseAction(getLabelList({ withUser: 'count' })),
    sort: {
      init: { column: 'updatedAt', direction: 'descending' },
    },
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

  useEffect(() => {
    console.debug('targetUpdate:', targetUpdate?.id)
    if (targetUpdate) {
      openUpdateModal()
    }
  }, [openUpdateModal, targetUpdate])

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
              list.setFilter({ free: el.target.value })
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
              <TableColumn key='updatedAt' allowsSorting>
                {t('item_updated_at')}
              </TableColumn>
              <TableColumn>{t('item_action')}</TableColumn>
            </TableHeader>
            <TableBody items={list.items}>
              {(label) => (
                <TableRow key={label.id}>
                  <TableCell>{label.name}</TableCell>
                  <TableCell>{label.explanation}</TableCell>
                  <TableCell>{dayformat(label.updatedAt, 'jp-simple')}</TableCell>
                  <TableCell>
                    <Dropdown
                      showArrow
                      classNames={{
                        base: 'before:bg-default-200',
                        content:
                          'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                      }}
                    >
                      <DropdownTrigger>
                        <Button isIconOnly variant='flat' color='primary' className='h-fit px-2 py-1'>
                          <EllipsisHorizontalIcon />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label='actions'>
                        <DropdownItem
                          key='edit'
                          startContent={<PencilSquareIcon />}
                          onPress={() => {
                            setTargetUpdate(label)
                          }}
                        >
                          {t('item_edit')}
                        </DropdownItem>
                        <DropdownItem
                          key='delete'
                          className='text-danger'
                          color='danger'
                          startContent={<TrashIcon />}
                          onPress={async () => {
                            const ok = await confirmModal().confirm({
                              title: t('item_delete_confirm'),
                              text: t('msg_label_delete', { name: label.name }),
                              requireCheck: true,
                              autoClose: false,
                            })
                            if (ok) {
                              await parseAction(deleteLabel({ id: label.id }))
                              await intervalOperation()
                              list.reload()
                              confirmModal().close()
                            }
                          }}
                        >
                          {t('item_delete')}
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <UpdateLabelModal
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
    </>
  )
}
