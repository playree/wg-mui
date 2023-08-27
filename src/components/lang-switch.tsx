'use client'

import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { FC, useMemo, useState } from 'react'

import { setCookie } from './nextekit/cookie/client'
import { useLocale } from './nextekit/locale/client'
import { LocaleConfig } from './nextekit/locale/types'

export const LangSwitch: FC<{ localeConfig: LocaleConfig; className?: string }> = ({ localeConfig, className }) => {
  const { locale, setLocale } = useLocale()
  const [selectedKeys, setSelectedKeys] = useState(new Set([locale]))
  const selectedValue = useMemo(() => Array.from(selectedKeys).join(', ').replaceAll('_', ' '), [selectedKeys])

  return (
    <Dropdown className={className}>
      <DropdownTrigger>
        <Button variant='bordered'>{`lang: ${selectedValue}`}</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Select Lang'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onAction={(key) => {
          const keyString = key.toString()
          console.log('key:', key)
          setSelectedKeys(new Set([keyString]))
          setCookie(localeConfig.cookie.name, keyString, { maxAge: localeConfig.cookie.maxAge })
          setLocale(keyString)
        }}
      >
        {localeConfig.locales.map((locale) => {
          return <DropdownItem key={locale}>{locale}</DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  )
}
