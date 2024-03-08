'use client'

import type { SetLocaleApi } from '@/app/api/locale/route'
import { fetchJson } from '@/helpers/fetch'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'

import { setCookie } from './nextekit/cookie/client'
import { useLocale } from './nextekit/locale/client'
import { LocaleConfig } from './nextekit/locale/types'

export const LangSwitch: FC<{ localeConfig: LocaleConfig; className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  localeConfig,
  className,
  size = 'md',
}) => {
  const { locale, setLocale } = useLocale()
  const { data: session } = useSession()
  const [selectedKeys, setSelectedKeys] = useState(new Set([locale]))
  const [selectedValue, setSelectedValue] = useState('')

  useEffect(() => {
    setSelectedKeys(new Set([locale]))
  }, [locale])

  useEffect(() => {
    setSelectedValue(Array.from(selectedKeys).join(', ').replaceAll('_', ' '))
  }, [selectedKeys])

  return (
    <Dropdown className={className} size={size}>
      <DropdownTrigger>
        <Button size={size} variant='bordered' className={className}>{`lang: ${selectedValue}`}</Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Select Lang'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onAction={(key) => {
          const keyString = key.toString()
          setSelectedKeys(new Set([keyString]))
          setCookie(localeConfig.cookie.name, keyString, { maxAge: localeConfig.cookie.maxAge, path: '/' })
          setLocale(keyString)

          if (session?.user) {
            if (keyString !== session.user.locale) {
              // ユーザーのロケール情報を更新
              if (session?.user) {
                console.debug('update user locale:', keyString)
                fetchJson<void, SetLocaleApi>('/api/locale', {
                  method: 'POST',
                  body: { locale: keyString },
                })
              }
            }
          }
          return
        }}
      >
        {localeConfig.locales.map((lc) => {
          return <DropdownItem key={lc}>{lc}</DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  )
}
