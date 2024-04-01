'use client'

import { useSharedUIContext } from '@/app/context'
import {
  ArrowPathIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  CommandLineIcon,
  PlayCircleIcon,
  StopCircleIcon,
  XCircleIcon,
} from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { GLOBAL_CIDR } from '@/helpers/const'
import {
  LocaleForm,
  WgConfForClients,
  WgConfPostScript,
  getLocaleFormSchema,
  scWgConfForClients,
  scWgConfPostScript,
} from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Textarea,
} from '@nextui-org/react'
import { Address4 } from 'ip-address'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

import {
  Settings,
  SystemInfo,
  disableWgAutoStart,
  ebableWgAutoStart,
  getPostUpDownScript,
  organizePeers,
  startWg,
  stopWg,
  updateSigninMessage,
  updateTopPageNotice,
  updateWgConfForClients,
  updateWgConfPostScript,
} from './server-actions'

export const Title: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_settings')}</span>
}

const FormWgConfPostScript: FC<{ safeWgConf: SystemInfo['safeWgConf'] }> = ({ safeWgConf }) => {
  const { t, fet } = useLocale()
  const [isEdited, setEdited] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WgConfPostScript>({
    resolver: zodResolver(scWgConfPostScript),
    mode: 'onChange',
    defaultValues: { postUp: safeWgConf.postUp || '', postDown: safeWgConf.postDown || '' },
  })

  return (
    <form
      onSubmit={handleSubmit(async (req) => {
        console.debug('FormWgConfPostScript:submit:', req)
        setLoading(true)
        await parseAction(updateWgConfPostScript(req))
        await intervalOperation()
        setLoading(false)
        setEdited(false)
      })}
    >
      <div className={gridStyles()}>
        <div className='col-span-12'>
          <ExButton
            color='default'
            variant='flat'
            size='sm'
            onPress={async () => {
              const script = await parseAction(getPostUpDownScript({ interfaceName: safeWgConf.interfaceName }))
              if (script) {
                setValue('postUp', script.up)
                setValue('postDown', script.down)
                if (!isEdited) {
                  setEdited(true)
                }
              }
            }}
          >
            <CommandLineIcon />
            {t('item_generate_post_updown')}
          </ExButton>
        </div>
        <div className='col-span-12'>
          <InputCtrl
            control={control}
            name='postUp'
            label={t('item_post_up')}
            errorMessage={fet(errors.postUp)}
            onChanged={() => {
              if (!isEdited) {
                setEdited(true)
              }
            }}
          />
        </div>
        <div className='col-span-12'>
          <InputCtrl
            control={control}
            name='postDown'
            label={t('item_post_down')}
            errorMessage={fet(errors.postDown)}
            onChanged={() => {
              if (!isEdited) {
                setEdited(true)
              }
            }}
          />
        </div>
        <div className='col-span-12 mb-2 text-right'>
          <ExButton
            type='submit'
            variant='flat'
            color='success'
            isSmart
            startContent={isLoading ? undefined : <CheckBadgeIcon />}
            isLoading={isLoading}
            isDisabled={!isEdited}
          >
            {t('item_update')}
          </ExButton>
        </div>
      </div>
    </form>
  )
}

const FormWgConfForClients: FC<{ safeWgConf: SystemInfo['safeWgConf'] }> = ({ safeWgConf }) => {
  const { t, fet } = useLocale()
  const [isEdited, setEdited] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WgConfForClients>({
    resolver: zodResolver(scWgConfForClients),
    mode: 'onChange',
    defaultValues: {
      endPoint: safeWgConf.endPoint,
      dns: safeWgConf.dns || '',
      defaultAllowedIPs: safeWgConf.defaultAllowedIPs || '',
      defaultKeepalive: safeWgConf.defaultKeepalive,
    },
  })

  return (
    <form
      onSubmit={handleSubmit(async (req) => {
        console.debug('FormWgConfForClients:submit:', req)
        setLoading(true)
        await parseAction(updateWgConfForClients(req))
        await intervalOperation()
        setLoading(false)
        setEdited(false)
      })}
    >
      <div className={gridStyles()}>
        <div className='col-span-12 md:col-span-6'>
          <InputCtrl
            control={control}
            name='endPoint'
            label={t('item_end_point')}
            errorMessage={fet(errors.endPoint)}
            isRequired
            onChanged={() => {
              if (!isEdited) {
                setEdited(true)
              }
            }}
          />
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
            onChanged={() => {
              if (!isEdited) {
                setEdited(true)
              }
            }}
          />
        </div>
        <div className='col-span-12'>
          <ExButton
            color='default'
            variant='flat'
            size='sm'
            onPress={async () => {
              const ifip = new Address4(safeWgConf.address)
              setValue('defaultAllowedIPs', `${ifip.startAddress().address}${ifip.subnet}, ${GLOBAL_CIDR}`)
              if (!isEdited) {
                setEdited(true)
              }
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
                onChange={(event) => {
                  if (!isEdited) {
                    setEdited(true)
                  }
                  onChange(event)
                }}
                value={value || ''}
                classNames={{ input: 'text-xs' }}
              />
            )}
          />
        </div>
        <div className='col-span-12 mb-2 text-right'>
          <ExButton
            type='submit'
            variant='flat'
            color='success'
            isSmart
            startContent={isLoading ? undefined : <CheckBadgeIcon />}
            isLoading={isLoading}
            isDisabled={!isEdited}
          >
            {t('item_update')}
          </ExButton>
        </div>
      </div>
    </form>
  )
}

const FormWgConf: FC<{ safeWgConf: SystemInfo['safeWgConf'] }> = ({ safeWgConf }) => {
  const { t } = useLocale()

  return (
    <Card className='mx-2 mb-2 w-full'>
      <CardBody>
        <div className={gridStyles()}>
          <div className='col-span-12'>
            <div className='mb-2'>{t('item_wg_conf')}</div>
            <Divider />
          </div>
          <div className='col-span-12 px-2 text-sm md:col-span-4'>
            {t('item_interface_name')} : {safeWgConf.interfaceName}
          </div>
          <div className='col-span-12 px-2 text-sm md:col-span-4'>
            {t('item_address')} : {safeWgConf.address}
          </div>
          <div className='col-span-12 px-2 text-sm md:col-span-4'>
            {t('item_listen_port')} : {safeWgConf.listenPort}
          </div>
          <div className='col-span-12 mt-2'>
            <Divider />
          </div>
        </div>
        <Accordion isCompact>
          <AccordionItem
            onKeyDown={(e) => e.stopPropagation()}
            key='post-script'
            aria-label='ac post-script'
            title={t('item_post_up_down')}
          >
            <FormWgConfPostScript safeWgConf={safeWgConf} />
          </AccordionItem>
          <AccordionItem
            onKeyDown={(e) => e.stopPropagation()}
            key='for-clinets'
            aria-label='ac for-clinets'
            title={t('item_for_clients')}
          >
            <FormWgConfForClients safeWgConf={safeWgConf} />
          </AccordionItem>
        </Accordion>
      </CardBody>
    </Card>
  )
}

export const SystemInfoClient: FC<{
  info: SystemInfo
}> = ({ info }) => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  const { confirmModal } = useSharedUIContext()
  const [isLoadingWgStart, setLoadingWgStart] = useState(false)
  const [isLoadingWgAutoStartEnable, setLoadingWgAutoStartEnable] = useState(false)
  const [isLoadingWgReboot, setLoadingWgReboot] = useState(false)

  return (
    <>
      <Table aria-label='system info' hideHeader className='mx-2 mb-2'>
        <TableHeader>
          <TableColumn>item</TableColumn>
          <TableColumn>status</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>WireGuard</TableCell>
            <TableCell>{info.wgVersion || t('msg_not_installed')}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell>
              <div hidden={!info.wgVersion} className={twMerge(gridStyles())}>
                <div className='col-span-6'>
                  <OnOffChip
                    isEnable={info.isWgStarted}
                    messageOn={t('item_starting')}
                    messageOff={t('item_stopped')}
                  />
                </div>
                <div className='col-span-6 flex items-center'>
                  <Divider orientation='vertical' className='mr-2' />
                  {info.isWgStarted ? (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      color='danger'
                      isSmart
                      startContent={isLoadingWgStart ? undefined : <StopCircleIcon />}
                      isLoading={isLoadingWgStart}
                      onPress={async () => {
                        console.debug('WireGuard Stop:')
                        const ok = await confirmModal().confirm({
                          title: t('item_confirme'),
                          text: t('msg_wg_stop_confirm'),
                          requireCheck: true,
                          autoClose: true,
                        })
                        if (ok) {
                          setLoadingWgStart(true)
                          await parseAction(stopWg())
                          await intervalOperation()
                          setLoadingWgStart(false)
                          refresh()
                        }
                      }}
                    >
                      {t('item_stop')}
                    </ExButton>
                  ) : (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      isSmart
                      startContent={isLoadingWgStart ? undefined : <PlayCircleIcon />}
                      isLoading={isLoadingWgStart}
                      onPress={async () => {
                        console.debug('WireGuard Start:')
                        setLoadingWgStart(true)
                        await parseAction(startWg())
                        await intervalOperation()
                        const organizeList = await parseAction(organizePeers())
                        console.debug('organizeList:', organizeList)
                        setLoadingWgStart(false)
                        refresh()
                      }}
                    >
                      {t('item_start')}
                    </ExButton>
                  )}
                  <ExButton
                    className='ml-2'
                    variant='solid'
                    color='warning'
                    isSmart
                    isDisabled={!info.isWgStarted}
                    startContent={isLoadingWgReboot ? undefined : <ArrowPathIcon />}
                    isLoading={isLoadingWgReboot}
                    onPress={async () => {
                      console.debug('WireGuard Reboot:')
                      const ok = await confirmModal().confirm({
                        title: t('item_confirme'),
                        text: t('msg_wg_restart_confirm'),
                        requireCheck: true,
                        autoClose: true,
                      })
                      if (ok) {
                        setLoadingWgReboot(true)
                        await parseAction(stopWg())
                        await parseAction(startWg())
                        await intervalOperation()
                        const organizeList = await parseAction(organizePeers())
                        console.debug('organizeList:', organizeList)
                        setLoadingWgReboot(false)
                        refresh()
                      }
                    }}
                  >
                    {t('item_restart')}
                  </ExButton>
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className='border-b-1 border-gray-300 dark:border-gray-700'>
            <TableCell>
              <div></div>
            </TableCell>
            <TableCell>
              <div hidden={!info.wgVersion} className={twMerge(gridStyles())}>
                <div className='col-span-6'>
                  <OnOffChip
                    isEnable={info.isWgAutoStartEnabled}
                    messageOn={t('item_autostart_on')}
                    messageOff={t('item_autostart_off')}
                  />
                </div>
                <div className='col-span-6 flex items-center'>
                  <Divider orientation='vertical' className='mr-2' />
                  {info.isWgAutoStartEnabled ? (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      color='danger'
                      isSmart
                      startContent={isLoadingWgAutoStartEnable ? undefined : <XCircleIcon />}
                      isLoading={isLoadingWgAutoStartEnable}
                      onPress={async () => {
                        console.debug('WireGuard AutoStart Disable:')
                        const ok = await confirmModal().confirm({
                          title: t('item_confirme'),
                          text: t('msg_wg_autostart_disable_confirm'),
                          requireCheck: true,
                          autoClose: true,
                        })
                        if (ok) {
                          setLoadingWgAutoStartEnable(true)
                          await parseAction(disableWgAutoStart())
                          await intervalOperation()
                          setLoadingWgAutoStartEnable(false)
                          refresh()
                        }
                      }}
                    >
                      {t('item_disable')}
                    </ExButton>
                  ) : (
                    <ExButton
                      className='ml-2'
                      variant='solid'
                      isSmart
                      startContent={isLoadingWgAutoStartEnable ? undefined : <CheckCircleIcon />}
                      isLoading={isLoadingWgAutoStartEnable}
                      onPress={async () => {
                        console.debug('WireGuard AutoStart Enable:')
                        setLoadingWgAutoStartEnable(true)
                        await parseAction(ebableWgAutoStart())
                        await intervalOperation()
                        setLoadingWgAutoStartEnable(false)
                        refresh()
                      }}
                    >
                      {t('item_enable')}
                    </ExButton>
                  )}
                </div>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className='border-b-1 border-gray-300 dark:border-gray-700'>
            <TableCell>IP Forward</TableCell>
            <TableCell>{info.ipForward || ''}</TableCell>
          </TableRow>
          <TableRow className='border-b-1 border-gray-300 dark:border-gray-700'>
            <TableCell>{t('item_google_signin')}</TableCell>
            <TableCell>
              <OnOffChip
                isEnable={info.isGoogleEnabled}
                messageOn={t('item_enabled')}
                messageOff={t('item_disabled')}
              />
            </TableCell>
          </TableRow>
          <TableRow className='border-b-1 border-gray-300 dark:border-gray-700'>
            <TableCell>{t('item_gitlab_signin')}</TableCell>
            <TableCell>
              <OnOffChip
                isEnable={info.isGitLabEnabled}
                messageOn={t('item_enabled')}
                messageOff={t('item_disabled')}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('item_send_mail')}</TableCell>
            <TableCell>
              <OnOffChip
                isEnable={info.sendMail.enabled}
                messageOn={info.sendMail.type}
                messageOff={t('item_disabled')}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <FormWgConf safeWgConf={info.safeWgConf} />
    </>
  )
}

const FormSigninMessage: FC<{ values: Record<string, string> }> = ({ values }) => {
  const { t, fet, lcConfig } = useLocale()
  const [isEdited, setEdited] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LocaleForm>({
    resolver: zodResolver(getLocaleFormSchema(200)),
    mode: 'onChange',
    defaultValues: values,
  })

  return (
    <form
      onSubmit={handleSubmit(async (req) => {
        console.debug('FormSigninMessage:submit:', req)
        setLoading(true)
        await parseAction(updateSigninMessage(req))
        await intervalOperation()
        setLoading(false)
        setEdited(false)
      })}
    >
      <div className={gridStyles()}>
        {lcConfig.locales.map((lc) => (
          <div key={lc} className='col-span-12'>
            <Controller
              control={control}
              name={lc}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  label={lc}
                  type='text'
                  variant='bordered'
                  size='sm'
                  minRows={2}
                  errorMessage={fet(errors[lc])}
                  onChange={(event) => {
                    if (!isEdited) {
                      setEdited(true)
                    }
                    onChange(event)
                  }}
                  value={value || ''}
                  classNames={{ input: 'text-xs' }}
                />
              )}
            />
          </div>
        ))}
        <div className='col-span-12 text-right'>
          <ExButton
            type='submit'
            variant='flat'
            color='success'
            isSmart
            startContent={isLoading ? undefined : <CheckBadgeIcon />}
            isLoading={isLoading}
            isDisabled={!isEdited}
          >
            {t('item_update')}
          </ExButton>
        </div>
      </div>
    </form>
  )
}

const FormTopPageNotice: FC<{ values: Record<string, string> }> = ({ values }) => {
  const { t, fet, lcConfig } = useLocale()
  const [isEdited, setEdited] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LocaleForm>({
    resolver: zodResolver(getLocaleFormSchema(200)),
    mode: 'onChange',
    defaultValues: values,
  })

  return (
    <form
      onSubmit={handleSubmit(async (req) => {
        console.debug('FormTopPageNotice:submit:', req)
        setLoading(true)
        await parseAction(updateTopPageNotice(req))
        await intervalOperation()
        setLoading(false)
        setEdited(false)
      })}
    >
      <div className={gridStyles()}>
        {lcConfig.locales.map((lc) => (
          <div key={lc} className='col-span-12'>
            <Controller
              control={control}
              name={lc}
              render={({ field: { onChange, value } }) => (
                <Textarea
                  label={lc}
                  type='text'
                  variant='bordered'
                  size='sm'
                  minRows={2}
                  errorMessage={fet(errors[lc])}
                  onChange={(event) => {
                    if (!isEdited) {
                      setEdited(true)
                    }
                    onChange(event)
                  }}
                  value={value || ''}
                  classNames={{ input: 'text-xs' }}
                />
              )}
            />
          </div>
        ))}
        <div className='col-span-12 text-right'>
          <ExButton
            type='submit'
            variant='flat'
            color='success'
            isSmart
            startContent={isLoading ? undefined : <CheckBadgeIcon />}
            isLoading={isLoading}
            isDisabled={!isEdited}
          >
            {t('item_update')}
          </ExButton>
        </div>
      </div>
    </form>
  )
}

export const SettingsClient: FC<{ settings: Settings }> = ({ settings: { signinMessage, topPageNotice } }) => {
  const { t } = useLocale()

  return (
    <Accordion variant='splitted'>
      <AccordionItem
        onKeyDown={(e) => e.stopPropagation()}
        key='signin-message'
        aria-label='ac signin-message'
        title={t('item_signin_message')}
      >
        <FormSigninMessage values={signinMessage} />
      </AccordionItem>
      <AccordionItem
        onKeyDown={(e) => e.stopPropagation()}
        key='top-page-notice'
        aria-label='ac top-page-notice'
        title={t('item_top_page_notice')}
      >
        <FormTopPageNotice values={topPageNotice} />
      </AccordionItem>
    </Accordion>
  )
}
