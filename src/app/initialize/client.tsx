'use client'

import { CheckIcon, Cog6ToothIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { InitializeWgConf, scInitializeWgConf } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

export const InitializeSettings: FC = () => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InitializeWgConf>({
    resolver: zodResolver(scInitializeWgConf),
    mode: 'onChange',
    defaultValues: {
      confDirPath: '/etc/wireguard',
      interfaceName: 'wg0',
      address: '172.16.15.1/24',
      privateKey: '',
      endPoint: 'wg.change.it:51820',
      dns: '',
    },
  })

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('menu_initial_setting')}</span>
      </div>

      <form
        onSubmit={handleSubmit(async (req) => {
          console.debug('create:submit:', req)
          setLoading(true)

          setLoading(false)
        })}
      >
        <div className={gridStyles()}>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='confDirPath'
              label={t('item_conf_dir_path')}
              errorMessage={fet(errors.confDirPath)}
              isRequired
            />
          </div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='interfaceName'
              label={t('item_interface_name')}
              errorMessage={fet(errors.interfaceName)}
              isRequired
            />
          </div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='address'
              label={t('item_address')}
              errorMessage={fet(errors.address)}
              isRequired
            />
          </div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='privateKey'
              label={t('item_private_key')}
              errorMessage={fet(errors.privateKey)}
              isRequired
            />
          </div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='endPoint'
              label={t('item_end_point')}
              errorMessage={fet(errors.endPoint)}
              isRequired
            />
          </div>
          <div className='col-span-12'>
            <InputCtrl control={control} name='dns' label={t('item_dns')} errorMessage={fet(errors.dns)} />
          </div>
          <div className='col-span-12 text-center'>
            <ExButton
              type='submit'
              variant='solid'
              startContent={isLoading ? undefined : <CheckIcon />}
              isLoading={isLoading}
            >
              {t('item_ok')}
            </ExButton>
          </div>
        </div>
      </form>
    </div>
  )
}
