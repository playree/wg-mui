'use client'

import { MoonFilledIcon, SunFilledIcon } from '@/components/icons'
import { Button } from '@nextui-org/button'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/dropdown'
import { SwitchProps, useSwitch } from '@nextui-org/switch'
import { useIsSSR } from '@react-aria/ssr'
import { VisuallyHidden } from '@react-aria/visually-hidden'
import { useTheme } from 'next-themes'
import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { iconSizes } from './styles'

export interface ThemeSwitchProps {
  className?: string
  classNames?: SwitchProps['classNames']
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className, classNames }) => {
  const { theme, setTheme } = useTheme()
  const isSSR = useIsSSR()

  const onChange = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }

  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch({
    isSelected: theme === 'light',
    'aria-label': `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`,
    onChange,
  })

  return (
    <Component
      {...getBaseProps({
        className: twMerge('cursor-pointer px-px transition-opacity hover:opacity-80', className, classNames?.base),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: twMerge(
            [
              'mx-0 h-auto w-auto rounded-lg bg-transparent px-0 pt-px',
              'flex items-center justify-center',
              'group-data-[selected=true]:bg-transparent',
              '!text-default-500',
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? <SunFilledIcon size={22} /> : <MoonFilledIcon size={22} />}
      </div>
    </Component>
  )
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
