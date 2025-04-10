'use client'

import {
  CloudIcon,
  Cog6ToothIcon,
  ComputerDesktopIcon,
  CubeIcon,
  GithubIcon,
  Squares2x2Icon,
  TagIcon,
  UserCircleIcon,
  UsersIcon,
} from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { SignOutLink } from '@/components/nextekit/auth/ui'
import { textStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { fetchJson } from '@/helpers/fetch'
import { SetLocaleApi } from '@/helpers/schema'
import { useLocale } from '@/locale/client'
import { Accordion, AccordionItem, AccordionItemProps, Button, Card, CardBody } from '@heroui/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FC, ReactNode, useEffect } from 'react'
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
  /** Close */
  closeMenu?: () => void
  /** アイコン */
  icon?: ReactNode
}> = ({ text, to, closeMenu, icon }) => {
  const router = useRouter()
  return (
    <div>
      <Button
        // href={to}
        // as={NextLink}
        color='default'
        variant='light'
        className='mb-2 h-8 w-full justify-start p-2'
        onPress={() => {
          router.push(to)
          if (closeMenu) {
            closeMenu()
          }
        }}
      >
        {icon}
        <span className={icon ? 'ml-1' : ''}>{text}</span>
      </Button>
    </div>
  )
}

export const Menu: FC<{ closeMenu?: () => void }> = ({ closeMenu }) => {
  const { t, locale } = useLocale()
  const { data: session, update } = useSession()

  useEffect(() => {
    if (session?.user) {
      if (!session.user.locale) {
        console.debug('initialize user locale:', locale)
        fetchJson<void, SetLocaleApi>('/api/locale', {
          method: 'POST',
          body: { locale },
        }).then(() => {
          update({ locale })
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <Card>
        <CardBody>
          <div className='flex items-center'>
            <UserCircleIcon className='mr-2' />
            <div>{session?.user?.name}</div>
          </div>
        </CardBody>
      </Card>
      <div // テーマ・言語
        className='flex p-2'
      >
        <ThemeSwitchList size='sm' className='mr-2' />
        <LangSwitch size='sm' />
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
              <MenuButton to='/' text={t('menu_dashboard')} icon={<Squares2x2Icon />} closeMenu={closeMenu} />
            </div>
            <div className='mx-2'>
              <MenuButton to='/peer' text={t('menu_peer')} icon={<CloudIcon />} closeMenu={closeMenu} />
            </div>
            <div className='mx-2'>
              <MenuButton to='/account' text={t('menu_account')} icon={<UserCircleIcon />} closeMenu={closeMenu} />
            </div>
          </AccordionItem>

          <AccordionItem isCompact={true} title={t('group_admin')} hidden={!session?.user?.isAdmin}>
            <div className='mx-2'>
              <MenuButton to='/admin/users' text={t('menu_users')} icon={<UsersIcon />} closeMenu={closeMenu} />
              <MenuButton to='/admin/labels' text={t('menu_labels')} icon={<TagIcon />} closeMenu={closeMenu} />
              <MenuButton
                to='/admin/peers'
                text={t('menu_peers')}
                icon={<ComputerDesktopIcon />}
                closeMenu={closeMenu}
              />
              <MenuButton
                to='/admin/settings'
                text={t('menu_settings')}
                icon={<Cog6ToothIcon />}
                closeMenu={closeMenu}
              />
            </div>
          </AccordionItem>
        </Accordion>
      </div>
      <div className='absolute inset-x-0 bottom-0 h-5 bg-gradient-to-r from-gray-200 dark:from-gray-900'>
        <footer
          className={twMerge(
            textStyles({ color: 'superlight' }),
            'flex h-full items-center justify-center gap-x-4 text-xs',
          )}
        >
          <div className='flex'>
            <CubeIcon size={16} className='mr-1' />
            <span className='font-bold'>WG-MUI</span>
          </div>
          <Link href='https://github.com/playree/wg-mui' className='flex'>
            <GithubIcon size={16} className='mr-1' />
            <span className='font-bold'>GitHub</span>
          </Link>
        </footer>
      </div>
    </div>
  )
}

export const getMenu = (closeMenu?: () => void) => {
  return <Menu closeMenu={closeMenu} />
}
