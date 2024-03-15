'use client'

import { CheckIcon, Cog6ToothIcon, KeyIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { useLocale } from '@/locale/client'
import { Card, CardBody } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { FC } from 'react'

export const LinkGoogleClient: FC<{ email: string }> = ({ email }) => {
  const { t } = useLocale()

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('item_link_google')}</span>
        <div className='right-0 flex flex-auto justify-end'>
          <ThemeSwitchList size='sm' className='mr-2' />
          <LangSwitch size='sm' />
        </div>
      </div>
      <div className={gridStyles()}>
        <div className='col-span-12 my-4'>
          <Card>
            <CardBody>{email}</CardBody>
          </Card>
        </div>
        <div className='col-span-12 mb-4 whitespace-pre-line'>{t('msg_link_google')}</div>
        <div className='col-span-12 text-center'>
          <ExButton variant='solid' onPress={() => signIn()} startContent={<KeyIcon />}>
            {t('item_signin_with_password')}
          </ExButton>
        </div>
      </div>
    </div>
  )
}

export const LinkedGoogleClient: FC = () => {
  const { t } = useLocale()

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('item_link_google')}</span>
        <div className='right-0 flex flex-auto justify-end'>
          <ThemeSwitchList size='sm' className='mr-2' />
          <LangSwitch size='sm' />
        </div>
      </div>
      <div className={gridStyles()}>
        <div className='col-span-12 my-4 whitespace-pre-line'>{t('msg_linked_google')}</div>
        <div className='col-span-12 text-center'>
          <ExButton variant='solid' href='/account' startContent={<CheckIcon />}>
            {t('item_ok')}
          </ExButton>
        </div>
      </div>
    </div>
  )
}
