'use client'

import { CheckIcon, Cog6ToothIcon, KeyIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { InitializeWgConf, scInitializeWgConf } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { localeConfig } from '@/locale/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import { changeConfDir, checkConfDir, getPrivateKey, initializeWgConf } from './server-actions'

export const InitializeSettings: FC = () => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<InitializeWgConf>({
    resolver: zodResolver(scInitializeWgConf),
    mode: 'onChange',
    defaultValues: {
      confDirPath: '/etc/wireguard',
      interfaceName: 'wg0',
      address: '172.16.15.1/24',
      listenPort: 51820,
      privateKey: '',
      postUp: '',
      postDown: '',
      endPoint: 'wg.change.it:51820',
      dns: '',
    },
  })

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('menu_initial_setting')}</span>
        <div className='right-0 flex flex-auto justify-end'>
          <ThemeSwitchList size='sm' className='mr-2' />
          <LangSwitch localeConfig={localeConfig} size='sm' />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(async (req) => {
          console.debug('create:submit:', req)
          setLoading(true)

          // ConfDirのアクセス権確認
          const exeUser = await checkConfDir(req.confDirPath)
          if (exeUser) {
            // アクセス権がない場合
            if (!window.confirm(t('msg_conf_dir_permission_confirm', { user: exeUser, path: req.confDirPath }))) {
              setLoading(false)
              return
            }
            // ConfDirのアクセス権付与
            await changeConfDir(req.confDirPath)
          }

          await initializeWgConf(req)
          await intervalOperation()
          setLoading(false)
          router.refresh()
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
          <div className='col-span-6'>
            <InputCtrl
              control={control}
              name='address'
              label={t('item_address')}
              errorMessage={fet(errors.address)}
              isRequired
            />
          </div>
          <div className='col-span-6'>
            <InputCtrl
              control={control}
              name='listenPort'
              type='number'
              label={t('item_listen_port')}
              errorMessage={fet(errors.listenPort)}
              isRequired
            />
          </div>
          <div className='col-span-11'>
            <InputCtrl
              control={control}
              name='privateKey'
              label={t('item_private_key')}
              errorMessage={fet(errors.privateKey)}
              isRequired
            />
          </div>
          <div className='col-span-1 flex items-center'>
            <ExButton
              isIconOnly
              color='default'
              variant='ghost'
              tooltip={t('item_generate_key')}
              onPress={async () => {
                const privateKey = await getPrivateKey()
                if (privateKey) {
                  setValue('privateKey', privateKey)
                }
              }}
            >
              <KeyIcon />
            </ExButton>
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
            <InputCtrl control={control} name='postUp' label={t('item_post_up')} errorMessage={fet(errors.postUp)} />
          </div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='postDown'
              label={t('item_post_down')}
              errorMessage={fet(errors.postDown)}
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
