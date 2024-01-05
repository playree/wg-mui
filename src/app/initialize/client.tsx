'use client'

import { gridStyles } from '@/components/styles'
import { InitializeWgConf, scInitializeWgConf } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@nextui-org/react'
import { FC } from 'react'
import { Controller, useForm } from 'react-hook-form'

export const InitializeSettings: FC = () => {
  const { t, fet } = useLocale()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InitializeWgConf>({
    resolver: zodResolver(scInitializeWgConf),
    mode: 'onChange',
    defaultValues: {
      confDirPath: '',
      interfaceName: '',
      address: '',
      privateKey: '',
      endPoint: '',
      dns: '',
    },
  })

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <form
        onSubmit={handleSubmit(async (req) => {
          console.debug('create:submit:', req)
        })}
      >
        <div className={gridStyles()}>
          <div className='col-span-12'>
            <Controller
              control={control}
              name='confDirPath'
              render={({ field: { onChange, value } }) => (
                <Input
                  type='text'
                  label={t('item_conf_dir_path')}
                  variant='bordered'
                  errorMessage={fet(errors.confDirPath)}
                  onChange={onChange}
                  value={value}
                  isRequired
                  placeholder='/etc/wireguard'
                />
              )}
            />
          </div>
          <div className='col-span-12'>
            <Controller
              control={control}
              name='interfaceName'
              render={({ field: { onChange, value } }) => (
                <Input
                  type='text'
                  label={t('item_interface_name')}
                  variant='bordered'
                  errorMessage={fet(errors.interfaceName)}
                  onChange={onChange}
                  value={value}
                  isRequired
                  placeholder='wg0'
                />
              )}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
