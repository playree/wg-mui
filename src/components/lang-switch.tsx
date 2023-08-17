'use client'

import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { FC, useMemo, useState } from 'react'

import { getCookie, getCookies } from './nextekit/cookie/client'

export const LangSwitch: FC = () => {
  const [selectedKeys] = useState(new Set(['ja' || '']))
  const selectedValue = useMemo(() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '), [selectedKeys])
  console.debug('getCookies:', getCookies())
  console.debug('getCookie:', getCookie('key1'))
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant='bordered'>{`lang: ${selectedValue}`}</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Select Lang'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => {
          console.log('keys:', keys)
        }}
      >
        <DropdownItem key='ja'>ja</DropdownItem>
        <DropdownItem key='en'>en</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
