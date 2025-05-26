'use client'

import { CheckIcon, KeyIcon, PlusCircleIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { requireSelect } from '@/helpers/client'
import { CreatePeer, TypePeer, TypeUser, UpdatePeer, scCreatePeer, scUpdatePeer } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
  Select,
  SelectItem,
  useDisclosure,
} from '@heroui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAsyncList } from '@react-stately/data'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createPeer, getFreeAddressList, getPrivateKey, updatePeer } from './server-actions'

// ピア管理

/** 作成モーダル */
const CreatePeerModal: FC<Omit<ModalProps, 'children'> & { user: TypeUser; updated: () => void }> = (props) => {
  const { user, updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const freeAddressList = useAsyncList({
    load: async () => ({ items: await parseAction(getFreeAddressList()) }),
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
    defaultValues: {
      ip: '',
      userId: user.id,
      privateKey: '',
      remarks: '',
    },
  })

  useEffect(() => {
    setLoading(false)
    reset()
    setValue('ip', freeAddressList.items[0])
  }, [reset, props.isOpen, setValue, freeAddressList.items])

  return (
    <Modal backdrop='blur' hideCloseButton {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('create:submit:', req)
              setLoading(true)
              await parseAction(createPeer(req))
              await intervalOperation()
              freeAddressList.reload()
              updated()
              onClose()
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_peer_create')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='ip'
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
              <ExButton type='submit' variant='solid' startContent={<CheckIcon />} isLoading={isLoading}>
                {t('item_ok')}
              </ExButton>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  )
}

/** 更新モーダル */
export const UpdatePeerModal: FC<Omit<ModalProps, 'children'> & { target?: TypePeer; updated: () => void }> = (
  props,
) => {
  const { target, updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const freeAddressList = useAsyncList({
    load: async () => ({ items: await parseAction(getFreeAddressList()) }),
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdatePeer>({
    resolver: zodResolver(scUpdatePeer),
    mode: 'onChange',
    defaultValues: {
      remarks: '',
    },
  })

  useEffect(() => {
    setLoading(false)
    reset()
  }, [reset, props.isOpen, setValue, freeAddressList.items])

  useEffect(() => {
    console.debug('target:', target?.ip)
    if (target) {
      setValue('ip', target.ip)
      setValue('remarks', target.remarks || '')
    }
  }, [target, props.isOpen, setValue])

  return (
    <Modal backdrop='blur' hideCloseButton {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('update:submit:', req)
              setLoading(true)
              await parseAction(updatePeer(req))
              await intervalOperation()
              freeAddressList.reload()
              updated()
              onClose()
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_peer_update')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <Input label={t('item_address')} value={target?.ip || ''} readOnly />
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
              <ExButton type='submit' variant='solid' startContent={<CheckIcon />} isLoading={isLoading}>
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
export const CreatePeerButtonWithModal: FC<{ user: TypeUser; updated: () => void }> = ({ user, updated }) => {
  const { t } = useLocale()
  const editModal = useDisclosure()
  return (
    <>
      <ExButton isIconOnly color='primary' tooltip={t('item_peer_create')} onPress={() => editModal.onOpen()}>
        <PlusCircleIcon />
      </ExButton>
      <CreatePeerModal
        size='xl'
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        user={user}
        updated={() => updated()}
      />
    </>
  )
}
