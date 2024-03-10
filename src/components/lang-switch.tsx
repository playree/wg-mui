'use client'

import { fetchJson } from '@/helpers/fetch'
import { SetLocaleApi } from '@/helpers/schema'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { useSession } from 'next-auth/react'
import { FC, useEffect, useState } from 'react'

import { setCookie } from './nextekit/cookie/client'
import { useLocale } from './nextekit/locale/client'

export const LangSwitch: FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className, size = 'md' }) => {
  const { locale, lcConfig, setLocale } = useLocale()
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
          setCookie(lcConfig.cookie.name, keyString, { maxAge: lcConfig.cookie.maxAge, path: '/' })
          setLocale(keyString)

          if (session?.user) {
            // ユーザーのロケール情報を更新
            if (session?.user) {
              console.debug('update user locale:', keyString)
              fetchJson<void, SetLocaleApi>('/api/locale', {
                method: 'POST',
                body: { locale: keyString },
              })
            }
          }
          return
        }}
      >
        {lcConfig.locales.map((lc) => {
          return <DropdownItem key={lc}>{lc}</DropdownItem>
        })}
      </DropdownMenu>
    </Dropdown>
  )
}
