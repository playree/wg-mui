'use client'

import {
  ArrowPathIcon,
  BoltIcon,
  DocumentArrowDownIcon,
  NewspaperIcon,
  PlusCircleIcon,
  QrCodeIcon,
} from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles, textStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { getQrImgString } from '@/helpers/qr'
import { TypePeer } from '@/helpers/schema'
import { PeerStatus } from '@/helpers/wgmgr'
import { useLocale } from '@/locale/client'
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  NumberInput,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { getUserPeerConf } from './server-actions'

export const PeerTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_peer')}</span>
}

export const RefreshButton: FC = () => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  return (
    <ExButton isIconOnly isSmart tooltip={t('item_refresh')} onPress={() => refresh()}>
      <ArrowPathIcon />
    </ExButton>
  )
}

const ConfModal: FC<Omit<ModalProps, 'children'> & { targetIp?: string }> = (props) => {
  const { targetIp, ...nextProps } = props
  const { t } = useLocale()

  const [allowdIps, setAllowdIps] = useState<'default' | 'all'>('default')
  const [useDns, setUseDns] = useState<'vpn' | 'google' | 'none'>('vpn')
  const [mtu, setMtu] = useState(0)
  const [qr, setQr] = useState<string>()

  useEffect(() => {
    if (targetIp) {
      setQr(undefined)
    }
  }, [targetIp, props.isOpen])

  return (
    <Modal backdrop='blur' hideCloseButton {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>
              {targetIp} - {t('item_conf_file')}
            </ModalHeader>
            <ModalBody>
              <div className={twMerge(gridStyles(), 'w-full')}>
                <div className='col-span-12 md:col-span-6'>
                  <Select
                    label={t('item_allowed_ips')}
                    labelPlacement='outside'
                    variant='bordered'
                    disallowEmptySelection
                    isRequired
                    selectedKeys={new Set([allowdIps])}
                    onSelectionChange={(e) => {
                      setAllowdIps((e.currentKey as 'default' | 'all') || 'default')
                    }}
                  >
                    <SelectItem key='default'>{t('item_allowed_ips_default')}</SelectItem>
                    <SelectItem key='all'>{t('item_allowed_ips_all')}</SelectItem>
                  </Select>
                </div>
                <div className='col-span-12 md:col-span-6'>
                  <Select
                    label={t('item_dns')}
                    labelPlacement='outside'
                    variant='bordered'
                    disallowEmptySelection
                    isRequired
                    selectedKeys={new Set([useDns])}
                    onSelectionChange={(e) => {
                      setUseDns((e.currentKey as 'vpn' | 'google' | 'none') || 'vpn')
                    }}
                  >
                    <SelectItem key='vpn'>{t('item_dns_vpn')}</SelectItem>
                    <SelectItem key='google'>{t('item_dns_google')}</SelectItem>
                    <SelectItem key='none'>{t('item_dns_none')}</SelectItem>
                  </Select>
                </div>
                <div className='col-span-12 md:col-span-4'>
                  <NumberInput
                    label={t('item_mtu')}
                    labelPlacement='outside'
                    variant='bordered'
                    value={mtu}
                    onValueChange={setMtu}
                  />
                </div>
                <div className='col-span-12 my-auto ml-2 md:col-span-8'>
                  <div className={twMerge(textStyles({ color: 'light' }), 'whitespace-pre-line text-xs')}>
                    {t('item_mtu_help')}
                  </div>
                  <div>
                    <Link className='text-xs' href='https://www.speedguide.net/analyzer.php' isExternal showAnchorIcon>
                      https://www.speedguide.net/analyzer.php
                    </Link>
                  </div>
                </div>
                <div className='col-span-12 mt-4 text-center md:col-span-6'>
                  <ExButton
                    variant='solid'
                    startContent={<DocumentArrowDownIcon />}
                    onPress={async () => {
                      if (targetIp) {
                        const res = await parseAction(
                          getUserPeerConf({
                            ip: targetIp,
                            useDns,
                            allowdIps,
                            mtu,
                          }),
                        )
                        const blob = new Blob([res.conf], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        document.body.appendChild(a)
                        a.download = res.filename
                        a.href = url
                        a.click()
                        a.remove()
                        URL.revokeObjectURL(url)
                      }
                    }}
                  >
                    {t('item_download_conf_file')}
                  </ExButton>
                </div>
                <div className='col-span-12 mt-4 text-center md:col-span-6'>
                  <ExButton
                    variant='solid'
                    color='secondary'
                    startContent={<QrCodeIcon />}
                    onPress={async () => {
                      if (targetIp) {
                        const res = await parseAction(
                          getUserPeerConf({
                            ip: targetIp,
                            useDns,
                            allowdIps,
                            mtu,
                          }),
                        )
                        const qrString = await getQrImgString(res.conf)
                        setQr(qrString)
                      }
                    }}
                  >
                    {t('item_scan_qr')}
                  </ExButton>
                </div>
                <div className='col-span-12 mt-4 text-center'>
                  {qr && <Image src={qr} alt='QR' width={320} classNames={{ wrapper: 'mx-auto' }} />}
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ExButton variant='solid' color='default' onPress={onClose}>
                {t('item_close')}
              </ExButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

const QrModal: FC<Omit<ModalProps, 'children'> & { target?: string }> = (props) => {
  const { target, ...nextProps } = props
  const { t } = useLocale()

  return (
    <Modal backdrop='blur' hideCloseButton {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{t('item_scan_qr')}</ModalHeader>
            <ModalBody>
              {target && <Image src={target} alt='QR' width={320} classNames={{ wrapper: 'mx-auto' }} />}
            </ModalBody>
            <ModalFooter>
              <ExButton variant='solid' onPress={onClose}>
                {t('item_close')}
              </ExButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export const PeerViewClient: FC<{ peerList: (TypePeer & { status?: PeerStatus })[] }> = ({ peerList }) => {
  const { t } = useLocale()

  const [targetQr, setTargetQr] = useState<string>()
  const qrModal = useDisclosure()

  const [targetIp, setTargetIp] = useState<string>()
  const confModal = useDisclosure()

  useEffect(() => {
    console.debug('targetQr:', !!targetQr)
    if (targetQr) {
      qrModal.onOpen()
    }
  }, [qrModal, targetQr])

  useEffect(() => {
    console.debug('targetIp:', !!targetIp)
    if (targetIp) {
      confModal.onOpen()
    }
  }, [confModal, targetIp])

  return (
    <>
      <div className={twMerge(gridStyles(), 'w-full')}>
        <div className='col-span-12 my-2 ml-2'>
          <Link href='https://www.wireguard.com/install/' isExternal showAnchorIcon>
            {t('item_download_client_tools')}
          </Link>
        </div>
        {peerList.map((peer) => {
          return (
            <Card key={peer.ip} className='col-span-12'>
              <CardHeader className='flex py-2'>
                <BoltIcon className='mr-2' />
                <span className='font-bold'>{peer.ip}</span>
              </CardHeader>
              <CardBody className={twMerge(gridStyles(), 'pl-10')}>
                <div className='col-span-12'>
                  <ExButton
                    startContent={<PlusCircleIcon />}
                    variant='flat'
                    color='primary'
                    className='h-fit px-2 py-1'
                    onPress={() => {
                      setTargetIp(peer.ip)
                    }}
                  >
                    {t('msg_add_tunnel')}
                  </ExButton>
                </div>

                <div className='col-span-12'>
                  <Divider />
                </div>
                <div className='col-span-12 flex items-center'>
                  <NewspaperIcon className='mr-2' />
                  {t('item_status')}
                </div>
                <div className={twMerge(gridStyles(), textStyles({ color: 'light' }), 'col-span-12 pl-4 text-sm')}>
                  {peer.status?.endpoint && (
                    <div className='col-span-12 flex items-center md:col-span-5'>
                      <span>{t('item_from_ip')} :</span>
                      <span className='ml-2'>{peer.status.endpoint}</span>
                    </div>
                  )}
                  {peer.status?.transfer && (
                    <div className='col-span-12 flex items-center md:col-span-7'>
                      <span>{t('item_transfer')} :</span>
                      <span className='ml-2'>{peer.status.transfer}</span>
                    </div>
                  )}
                  {peer.status?.latestHandshake && (
                    <div className='col-span-12 flex items-center'>
                      <span>{t('item_latest_handshake')} :</span>
                      <span className='ml-2'>{peer.status.latestHandshake}</span>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
      <QrModal
        size='xl'
        isOpen={qrModal.isOpen}
        onOpenChange={qrModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetQr}
        onClose={() => setTargetQr(undefined)}
      />
      <ConfModal
        size='xl'
        isOpen={confModal.isOpen}
        onOpenChange={confModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        targetIp={targetIp}
        onClose={() => setTargetIp(undefined)}
      />
    </>
  )
}
