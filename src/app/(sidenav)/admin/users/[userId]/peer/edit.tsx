'use client'

import { CheckIcon, KeyIcon, PlusCircleIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { requireSelect } from '@/helpers/client'
import { CreatePeer, scCreatePeer } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react'
import { useAsyncList } from '@react-stately/data'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createPeer, getFreeAddressList, getPrivateKey } from './server-actions'

// ピア管理

/** 作成モーダル */
const CreatePeerModal: FC<Omit<ModalProps, 'children'> & { updated: () => void }> = (props) => {
  const { updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const freeAddressList = useAsyncList({
    async load() {
      const items = await getFreeAddressList()
      console.debug('list:', items)
      return { items }
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<CreatePeer>({
    resolver: zodResolver(scCreatePeer),
    mode: 'onChange',
    defaultValues: { address: '', privateKey: '', allowedIPs: '', persistentKeepalive: 25, remarks: '' },
  })

  useEffect(() => {
    setLoading(false)
    reset()
    setValue('address', freeAddressList.items[0])
  }, [reset, props.isOpen, setValue, freeAddressList.items])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.debug('errors:', errors)
    }
  }, [errors])

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('create:submit:', req)
              setLoading(true)
              await createPeer()
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_user_create')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='address'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        label={t('item_address')}
                        variant='bordered'
                        onChange={requireSelect(onChange)}
                        selectedKeys={new Set([value])}
                        isRequired
                      >
                        {freeAddressList.items.map((address) => (
                          <SelectItem key={address} textValue={address}>
                            {address}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
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
                    name='allowedIPs'
                    label={t('item_allowed_ips')}
                    errorMessage={fet(errors.allowedIPs)}
                  />
                </div>
                <div className='col-span-12'>
                  <InputCtrl
                    control={control}
                    name='remarks'
                    label={t('item_remarks')}
                    errorMessage={fet(errors.remarks)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <ExButton color='danger' onPress={onClose}>
                {t('item_cancel')}
              </ExButton>
              <ExButton
                type='submit'
                variant='solid'
                startContent={isLoading ? undefined : <CheckIcon />}
                isLoading={isLoading}
              >
                {t('item_ok')}
              </ExButton>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

/** ピア作成ボタン */
export const CreatePeerButtonWithModal: FC<{ updated: () => void }> = ({ updated }) => {
  const { t } = useLocale()
  const editModal = useDisclosure()
  return (
    <>
      <ExButton isIconOnly color='primary' tooltip={t('item_peer_add')} onPress={() => editModal.onOpen()}>
        <PlusCircleIcon />
      </ExButton>
      <CreatePeerModal
        size='xl'
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        updated={() => updated()}
      />
    </>
  )
}
