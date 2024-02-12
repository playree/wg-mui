'use client'

import { ArrowPathIcon, CheckIcon, DocumentArrowDownIcon, QrCodeIcon, SignalIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { TypePeer } from '@/helpers/schema'
import { useLocale } from '@/locale'
import {
  Card,
  CardBody,
  CardHeader,
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

const QrModal: FC<Omit<ModalProps, 'children'> & { target?: TypePeer }> = (props) => {
  const { target, ...nextProps } = props
  const { t } = useLocale()

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>QR</ModalHeader>
            <ModalBody></ModalBody>
            <ModalFooter>
              <ExButton color='danger' onPress={onClose}>
                {t('item_cancel')}
              </ExButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}

export const PeerViewClient: FC<{ peerList: TypePeer[] }> = ({ peerList }) => {
  const { t } = useLocale()

  const [targetQr, setTargetQr] = useState<TypePeer>()
  const qrModal = useDisclosure()
  const openQrModal = qrModal.onOpen

  useEffect(() => {
    console.debug('targetQr:', targetQr)
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
                <SignalIcon className='mr-2' />
                <span className='font-bold'>{peer.ip}</span>
              </CardHeader>
              <CardBody className={twMerge(gridStyles(), 'pl-10')}>
                <div className='col-span-12'>{t('msg_add_tunnel')}</div>
                <div className='col-span-12 pl-4'>
                  <ExButton>
                    <DocumentArrowDownIcon />
                    {t('item_download_file')}
                  </ExButton>
                  <ExButton
                    onPress={() => {
                      setTargetQr(peer)
                    }}
                  >
                    <QrCodeIcon />
                    {t('item_scan_qr')}
                  </ExButton>
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
      />
    </>
  )
}
