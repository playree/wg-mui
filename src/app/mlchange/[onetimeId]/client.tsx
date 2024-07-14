'use client'

import { CheckIcon, Cog6ToothIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { useLocale } from '@/locale/client'
import { FC } from 'react'

export const EmailChangeClient: FC<{ email: string }> = ({ email }) => {
  const { t } = useLocale()

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('menu_email_change')}</span>
        <div className='right-0 flex flex-auto justify-end'>
          <ThemeSwitchList size='sm' className='mr-2' />
          <LangSwitch size='sm' />
        </div>
      </div>

      <div className={gridStyles()}>
        <div className='col-span-12 mb-2 whitespace-pre-line'>{t('msg_confirmed_email', { email })}</div>
        <div className='col-span-12 mt-4 text-center'>
          <ExButton variant='solid' startContent={<CheckIcon />} href='/account'>
            {t('item_ok')}
          </ExButton>
        </div>
      </div>
    </div>
  )
}
