'use client'

import { CheckIcon, Cog6ToothIcon, CommandLineIcon, EyeIcon, EyeSlashIcon, KeyIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { PasswordScore } from '@/components/password-score'
import { gridStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { parseAction } from '@/helpers/action'
import { GLOBAL_CIDR } from '@/helpers/const'
import { InitializeWgConf, UserPassword, scInitializeWgConf, scUserPassword } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Textarea } from "@heroui/react"
import { zxcvbn } from '@zxcvbn-ts/core'
import { Address4 } from 'ip-address'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useSharedUIContext } from '../context'
import {
  changeConfDir,
  checkConfDir,
  createAdminUser,
  getPostUpDownScript,
  getPrivateKey,
  initializeWgConf,
} from './server-actions'

export const InitializeAdmin: FC = () => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [passwordScore, setPasswordScore] = useState(0)
  const requiredPasswordScore = 4

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
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
          <LangSwitch size='sm' />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(async (req) => {
          console.debug('create:submit:', req)
          setLoading(true)

          // パスワードスコアチェック
          if (req.password) {
            if (passwordScore < requiredPasswordScore) {
              setError('password', { message: '@invalid_password_score' })
              setLoading(false)
              return
            }
          }

          await parseAction(createAdminUser(req))
          await intervalOperation()
          await signIn('credentials', {
            redirect: false,
            username: req.username,
            password: req.password,
          }).then(() => {
            setLoading(false)
            router.refresh()
          })
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
              onChanged={(event) => {
                const res = zxcvbn(event.target.value)
                setPasswordScore(res.score)
              }}
            />
            <PasswordScore
              label={`${t('item_password_score')} = ${passwordScore} ( ${t('msg_password_score_required', { score: requiredPasswordScore })}`}
              score={passwordScore}
            />
          </div>

          <div className='col-span-12 mt-4 text-center'>
            <ExButton type='submit' variant='solid' startContent={<CheckIcon />} isLoading={isLoading}>
              {t('item_ok')}
            </ExButton>
          </div>
        </div>
      </form>
    </div>
  )
}

export const SigninRedirect: FC = () => {
  useEffect(() => {
    signIn()
  }, [])

  return <></>
}

export const WgNotInstall: FC = () => {
  const { t } = useLocale()
  const router = useRouter()

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('menu_initial_setting')}</span>
        <div className='right-0 flex flex-auto justify-end'>
          <ThemeSwitchList size='sm' className='mr-2' />
          <LangSwitch size='sm' />
        </div>
      </div>

      <div className={gridStyles()}>
        <div className='col-span-12 mb-2 whitespace-pre-line'>{t('msg_wg_install')}</div>
        <div className='col-span-12'>
          <Link isExternal href='https://www.wireguard.com/install/'>
            https://www.wireguard.com/install/
          </Link>
        </div>
        <div className='col-span-12 mt-4 text-center'>
          <ExButton
            variant='solid'
            onPress={() => {
              router.refresh()
            }}
          >
            {t('item_wg_install_next')}
          </ExButton>
        </div>
      </div>
    </div>
  )
}

export const InitializeSettings: FC<{ hostname: string }> = ({ hostname }) => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()
  const { confirmModal } = useSharedUIContext()

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
          <LangSwitch size='sm' />
        </div>
      </div>

      <form
        onSubmit={handleSubmit(async (req) => {
          console.debug('create:submit:', req)
          setLoading(true)

          // ConfDirのアクセス権確認
          const exeUser = await parseAction(checkConfDir({ confDirPath: req.confDirPath }))
          if (exeUser) {
            const ok = await confirmModal().confirm({
              title: t('item_confirme'),
              text: t('msg_conf_dir_permission_confirm', { user: exeUser, path: req.confDirPath }),
              requireCheck: false,
              autoClose: true,
            })
            // アクセス権がない場合
            if (!ok) {
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
              label={t('item_default_keepalive')}
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
            <ExButton type='submit' variant='solid' startContent={<CheckIcon />} isLoading={isLoading}>
              {t('item_ok')}
            </ExButton>
          </div>
        </div>
      </form>
    </div>
  )
}
