'use client'

import { UserCircleIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ThemeSwitch } from '@/components/theme-switch'
import { useLocaleW } from '@/locale'
import { localeConfig } from '@/locale/config'
import { Accordion, AccordionItem, AccordionItemProps, Button, Link } from '@nextui-org/react'
import NextLink from 'next/link'
import { FC } from 'react'

const accordionStyles: AccordionItemProps['classNames'] = {
  title: '',
  titleWrapper: 'flex-none',
}

export const Menu: FC = () => {
  const { t } = useLocaleW()
  return (
    <div>
      <div className='flex px-2'>
        <ThemeSwitch className='mr-2' />
        <LangSwitch localeConfig={localeConfig} />
      </div>
      <div className='mt-2'>
        <Accordion selectionMode='multiple' itemClasses={accordionStyles} defaultSelectedKeys='all'>
          <AccordionItem isCompact={true} startContent={<UserCircleIcon size={20} />} title={t('group_user')}>
            <ul className='ml-8 list-disc'>
              <li>
                <Button href='/blog' as={NextLink} color='default' variant='light' className='min-w-0 px-2'>
                  test
                </Button>
              </li>
            </ul>
          </AccordionItem>
          <AccordionItem isCompact={true} startContent={<UserCircleIcon size={20} />} title={t('group_admin')}>
            bbb
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
