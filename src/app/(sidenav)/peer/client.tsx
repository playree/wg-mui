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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  useDisclosure,
} from '@nextui-org/react'
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
      <div className={twMerge(gridStyles(), 'mt-4 w-full')}>
        {peerList.map((peer) => {
          return (
            <Card key={peer.ip} className='col-span-12'>
              <CardHeader className='flex py-2'>
                <BoltIcon className='mr-2' />
                <span className='font-bold'>{peer.ip}</span>
              </CardHeader>
              <CardBody className={twMerge(gridStyles(), 'pl-10')}>
                <div className='col-span-12 flex items-center'>
                  <PlusCircleIcon className='mr-2' />
                  {t('msg_add_tunnel')}
                </div>
                <div className='col-span-12 pl-4'>
                  <ExButton
                    onPress={async () => {
                      const res = await getUserPeerConf({ ip: peer.ip })
                      if (res.ok) {
                        const blob = new Blob([res.data], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        document.body.appendChild(a)
                        a.download = `${peer.ip.replace('.', '-')}.conf`
                        a.href = url
                        a.click()
                        a.remove()
                        URL.revokeObjectURL(url)
                      }
                    }}
                  >
                    <DocumentArrowDownIcon />
                    {t('item_download_file')}
                  </ExButton>
                  <ExButton
                    onPress={async () => {
                      const res = await getUserPeerConf({ ip: peer.ip })
                      if (res.ok) {
                        const qr = await getQrImgString(res.data)
                        setTargetQr(qr)
                      }
                    }}
                  >
                    <QrCodeIcon />
                    {t('item_scan_qr')}
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
    </>
  )
}
