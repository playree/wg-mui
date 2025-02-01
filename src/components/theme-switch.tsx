'use client'

import { MoonFilledIcon, SunFilledIcon } from '@/components/icons'
import { Button } from '@heroui/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown'
import { SwitchProps } from '@heroui/switch'
import { useTheme } from 'next-themes'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import { iconSizes } from './styles'

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
}

export const ThemeSwitchList: FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({ className, size = 'md' }) => {
  const iconSize = iconSizes[size]
  const { theme, setTheme, systemTheme } = useTheme()
  const [selectedKeys, setSelectedKeys] = useState(new Set([theme || 'system']))

  const lightIcon = useMemo(() => <SunFilledIcon size={iconSize} />, [iconSize])
  const darkIcon = useMemo(() => <MoonFilledIcon size={iconSize} />, [iconSize])
  const [systemIcon, setSystemIcon] = useState<ReactNode>()
  const [selectIcon, setSelectIcon] = useState<ReactNode>()
  const [selectedValue, setSelectedValue] = useState('Loading')

  useEffect(() => {
    setSystemIcon(systemTheme === 'dark' ? darkIcon : lightIcon)
  }, [darkIcon, lightIcon, systemTheme])

  useEffect(() => {
    console.debug('theme:', theme)
    switch (theme) {
      case 'system':
        setSelectIcon(systemIcon)
        break
      case 'light':
        setSelectIcon(lightIcon)
        break
      case 'dark':
        setSelectIcon(darkIcon)
        break
    }
  }, [darkIcon, lightIcon, systemIcon, theme])

  useEffect(() => {
    setSelectedValue(Array.from(selectedKeys).join(', ').replaceAll('_', ' '))
  }, [selectedKeys])

  return (
    <Dropdown className={className} size={size}>
      <DropdownTrigger>
        <Button size={size} variant='bordered' startContent={selectIcon} className={className}>
          {selectedValue === 'system' ? 'auto' : selectedValue}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Select Theme'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={selectedKeys}
        onAction={(key) => {
          const keyString = key.toString()
          setSelectedKeys(new Set([keyString]))
          setTheme(keyString)
        }}
      >
        <DropdownItem key='system' startContent={systemIcon}>
          auto
        </DropdownItem>
        <DropdownItem key='light' startContent={lightIcon}>
          light
        </DropdownItem>
        <DropdownItem key='dark' startContent={darkIcon}>
          dark
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
