'use client'

import { Cog6ToothIcon, Squares2x2Icon, UsersIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { SignOutLink } from '@/components/nextekit/auth/ui'
import { textStyles } from '@/components/styles'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLocaleW } from '@/locale'
import { localeConfig } from '@/locale/config'
import { Accordion, AccordionItem, AccordionItemProps, Button } from '@nextui-org/react'
import NextLink from 'next/link'
import { FC, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

const accordionStyles: AccordionItemProps['classNames'] = {
  title: '',
  titleWrapper: 'flex-none',
}

export const MenuButton: FC<{
  /** メニューテキスト */
  text: string
  /** 遷移先 */
  to: string
  /** アイコン */
  icon?: ReactNode
}> = ({ text, to, icon }) => {
  return (
    <div>
      <Button href={to} as={NextLink} color='default' variant='light' className='mb-2 h-8 w-full justify-start p-2'>
        {icon}
        <span className={icon ? 'ml-1' : ''}>{text}</span>
      </Button>
    </div>
  )
}

export const Menu: FC = () => {
  const { t } = useLocaleW()
  return (
    <div>
      <div // テーマ・言語
        className='flex p-2'
      >
        <ThemeSwitch className='mr-2' />
        <LangSwitch localeConfig={localeConfig} />
      </div>

      <div // サインアウト
        className='flex p-2'
      >
        <SignOutLink className={twMerge(textStyles(), 'text-sm')} iconSize={20}>
          {t('menu_signout')}
        </SignOutLink>
      </div>

      <div className='mt-2'>
        <Accordion selectionMode='multiple' itemClasses={accordionStyles} defaultSelectedKeys='all' showDivider={false}>
          <AccordionItem isCompact={true} title={t('group_user')}>
            <div className='mx-2'>
              <MenuButton to='/about' text={t('menu_dashboard')} icon={<Squares2x2Icon size={20} />} />
            </div>
          </AccordionItem>
          <AccordionItem isCompact={true} title={t('group_admin')}>
            <div className='mx-2'>
              <MenuButton to='/users' text={t('menu_users')} icon={<UsersIcon size={20} />} />
              <MenuButton to='/settings' text={t('menu_settings')} icon={<Cog6ToothIcon size={20} />} />
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
