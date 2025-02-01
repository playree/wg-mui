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
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  useDisclosure,
} from "@heroui/react"
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

const QrModal: FC<Omit<ModalProps, 'children'> & { target?: string }> = (props) => {
  const { target, ...nextProps } = props
  const { t } = useLocale()

  return (
    <Modal backdrop='blur' {...nextProps}>
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
  const openQrModal = qrModal.onOpen

  useEffect(() => {
    console.debug('targetQr:', !!targetQr)
    if (targetQr) {
      openQrModal()
    }
  }, [openQrModal, targetQr])

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
                  <Dropdown
                    showArrow
                    classNames={{
                      base: 'before:bg-default-200',
                      content:
                        'py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                    }}
                  >
                    <DropdownTrigger>
                      <Button
                        startContent={<PlusCircleIcon />}
                        variant='flat'
                        color='primary'
                        className='h-fit px-2 py-1'
                      >
                        {t('msg_add_tunnel')}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label='add_tunnel'>
                      <DropdownItem
                        key='download'
                        startContent={<DocumentArrowDownIcon />}
                        onPress={async () => {
                          const res = await parseAction(getUserPeerConf({ ip: peer.ip, useDNS: false }))
                          const blob = new Blob([res.conf], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          document.body.appendChild(a)
                          a.download = res.filename
                          a.href = url
                          a.click()
                          a.remove()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        {t('item_download_conf_file')}
                      </DropdownItem>
                      <DropdownItem
                        key='download_dns'
                        startContent={<DocumentArrowDownIcon />}
                        onPress={async () => {
                          const res = await parseAction(getUserPeerConf({ ip: peer.ip, useDNS: true }))
                          const blob = new Blob([res.conf], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          document.body.appendChild(a)
                          a.download = res.filename
                          a.href = url
                          a.click()
                          a.remove()
                          URL.revokeObjectURL(url)
                        }}
                      >
                        {t('item_download_conf_file_dns')}
                      </DropdownItem>
                      <DropdownItem
                        key='qr'
                        startContent={<QrCodeIcon />}
                        onPress={async () => {
                          const res = await parseAction(getUserPeerConf({ ip: peer.ip, useDNS: false }))
                          const qr = await getQrImgString(res.conf)
                          setTargetQr(qr)
                        }}
                      >
                        {t('item_scan_qr')}
                      </DropdownItem>
                      <DropdownItem
                        key='qr_dns'
                        startContent={<QrCodeIcon />}
                        onPress={async () => {
                          const res = await parseAction(getUserPeerConf({ ip: peer.ip, useDNS: true }))
                          const qr = await getQrImgString(res.conf)
                          setTargetQr(qr)
                        }}
                      >
                        {t('item_scan_qr_dns')}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
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
    </>
  )
}
