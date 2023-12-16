'use client'

import { Cog6ToothIcon, Squares2x2Icon, TagIcon, UsersIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { SignOutLink } from '@/components/nextekit/auth/ui'
import { textStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { useLocale } from '@/locale'
import { localeConfig } from '@/locale/config'
import { Accordion, AccordionItem, AccordionItemProps, Button, Card, CardBody } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
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
  const { t } = useLocale()
  const { data: session } = useSession()
  return (
    <div>
      <Card>
        <CardBody>{session?.user.name}</CardBody>
      </Card>
      <div // テーマ・言語
        className='flex p-2'
      >
        <ThemeSwitchList size='sm' className='mr-2' />
        <LangSwitch localeConfig={localeConfig} size='sm' />
      </div>

      <div // サインアウト
        className='flex p-2'
      >
        <SignOutLink className={twMerge(textStyles(), 'text-sm')}>{t('menu_signout')}</SignOutLink>
      </div>

      <div className='mt-2'>
        <Accordion selectionMode='multiple' itemClasses={accordionStyles} defaultSelectedKeys='all' showDivider={false}>
          <AccordionItem isCompact={true} title={t('group_user')}>
            <div className='mx-2'>
              <MenuButton to='/' text={t('menu_dashboard')} icon={<Squares2x2Icon />} />
            </div>
            <div className='mx-2'>
              <MenuButton to='/about' text='about' icon={<Squares2x2Icon />} />
            </div>
            <div className='mx-2'>
              <MenuButton to='/open' text='open' icon={<Squares2x2Icon />} />
            </div>
          </AccordionItem>

          <AccordionItem isCompact={true} title={t('group_admin')} hidden={!session?.user.isAdmin}>
            <div className='mx-2'>
              <MenuButton to='/admin/users' text={t('menu_users')} icon={<UsersIcon />} />
              <MenuButton to='/admin/labels' text={t('menu_labels')} icon={<TagIcon />} />
              <MenuButton to='/admin/settings' text={t('menu_settings')} icon={<Cog6ToothIcon />} />
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
