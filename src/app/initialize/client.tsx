'use client'

import { CheckIcon, Cog6ToothIcon, CommandLineIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { parseAction } from '@/helpers/action'
import { InitializeWgConf, UserPassword, scInitializeWgConf, scUserPassword } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { localeConfig } from '@/locale/config'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@nextui-org/react'
import { Address4 } from 'ip-address'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import {
  changeConfDir,
  checkConfDir,
  createAdminUser,
  getPostUpDownScript,
  getPrivateKey,
  initializeWgConf,
} from './server-actions'

const GLOBAL_CIDR =
  '0.0.0.0/5, 8.0.0.0/7, 11.0.0.0/8, 12.0.0.0/6, 16.0.0.0/4, 32.0.0.0/3, 64.0.0.0/2, 128.0.0.0/3, 160.0.0.0/5, 168.0.0.0/6, 172.0.0.0/12, 172.32.0.0/11, 172.64.0.0/10, 172.128.0.0/9, 173.0.0.0/8, 174.0.0.0/7, 176.0.0.0/4, 192.0.0.0/9, 192.128.0.0/11, 192.160.0.0/13, 192.169.0.0/16, 192.170.0.0/15, 192.172.0.0/14, 192.176.0.0/12, 192.192.0.0/10, 193.0.0.0/8, 194.0.0.0/7, 196.0.0.0/6, 200.0.0.0/5, 208.0.0.0/4'

export const InitializeAdmin: FC = () => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserPassword>({
    resolver: zodResolver(scUserPassword),
    mode: 'onChange',
    defaultValues: {
      username: '',
      password: '',
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
          await parseAction(createAdminUser(req))
          await intervalOperation()
          setLoading(false)
          router.refresh()
        })}
      >
        <div className={gridStyles()}>
          <div className='col-span-12 mb-2'>{t('msg_create_admin')}</div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='username'
              label={t('item_username')}
              autoComplete='username'
              errorMessage={fet(errors.username)}
              isRequired
            />
          </div>
          <div className='col-span-12'>
            <InputCtrl
              control={control}
              name='password'
              label={t('item_password')}
              variant='bordered'
              endContent={
                <button className='focus:outline-none' type='button' onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashIcon className='pointer-events-none text-2xl text-default-400' />
                  ) : (
                    <EyeIcon className='pointer-events-none text-2xl text-default-400' />
                  )}
                </button>
              }
              type={isVisible ? 'text' : 'password'}
              autoComplete='new-password'
              errorMessage={fet(errors.password)}
              isRequired
            />
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

export const InitializeSettings: FC<{ hostname: string }> = ({ hostname }) => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
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
      endPoint: `${hostname}:51820`,
      dns: '',
      defaultAllowedIPs: '',
      defaultKeepalive: 25,
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
          const exeUser = await parseAction(checkConfDir({ confDirPath: req.confDirPath }))
          if (exeUser) {
            // アクセス権がない場合
            if (!window.confirm(t('msg_conf_dir_permission_confirm', { user: exeUser, path: req.confDirPath }))) {
              setLoading(false)
              return
            }
            // ConfDirのアクセス権付与
            await parseAction(changeConfDir({ confDirPath: req.confDirPath }))
          }

          await parseAction(initializeWgConf(req))
          await intervalOperation()
          setLoading(false)
          router.refresh()
        })}
      >
        <div className={gridStyles()}>
          <div className='col-span-12 mb-2'>{t('msg_initialize_wg')}</div>
          <div className='col-span-12 md:col-span-6'>
            <InputCtrl
              control={control}
              name='confDirPath'
              label={t('item_conf_dir_path')}
              errorMessage={fet(errors.confDirPath)}
              isRequired
            />
          </div>
          <div className='col-span-12 md:col-span-6'>
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
              min={1}
              max={65535}
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
              variant='flat'
              tooltip={t('item_generate_key')}
              onPress={async () => {
                const privateKey = await parseAction(getPrivateKey())
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
            <ExButton
              color='default'
              variant='flat'
              size='sm'
              onPress={async () => {
                const script = await parseAction(getPostUpDownScript({ interfaceName: getValues('interfaceName') }))
                if (script) {
                  setValue('postUp', script.up)
                  setValue('postDown', script.down)
                }
              }}
            >
              <CommandLineIcon />
              {t('item_generate_post_updown')}
            </ExButton>
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
          <div className='col-span-12 md:col-span-6'>
            <InputCtrl control={control} name='dns' label={t('item_dns')} errorMessage={fet(errors.dns)} />
          </div>
          <div className='col-span-12 md:col-span-6'>
            <InputCtrl
              control={control}
              name='defaultKeepalive'
              type='number'
              label={t('item_default_allowed_ips')}
              errorMessage={fet(errors.defaultKeepalive)}
              isRequired
              min={0}
              max={600}
            />
          </div>
          <div className='col-span-12'>
            <ExButton
              color='default'
              variant='flat'
              size='sm'
              onPress={async () => {
                const ifip = new Address4(getValues('address'))
                setValue('defaultAllowedIPs', `${ifip.startAddress().address}${ifip.subnet}, ${GLOBAL_CIDR}`)
              }}
            >
              <CommandLineIcon />
              {t('item_generate_global_cidr')}
            </ExButton>
          </div>
          <div className='col-span-12'>
            <Controller
              control={control}
              name='defaultAllowedIPs'
              render={({ field: { onChange, value } }) => (
                <Textarea
                  label={t('item_default_allowed_ips')}
                  type='text'
                  variant='bordered'
                  size='sm'
                  minRows={2}
                  errorMessage={fet(errors.defaultAllowedIPs)}
                  onChange={onChange}
                  value={value || ''}
                  classNames={{ input: 'text-xs' }}
                />
              )}
            />
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
