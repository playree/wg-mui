'use client'

import { CheckIcon, DocumentPlusIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { EditLabel, TypeLabel, scEditLabel } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Checkbox,
  Input,
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
import { Controller, useForm } from 'react-hook-form'

import { createLabel, deleteLabel, existsLabelName, updateLabel } from './server-actions'

// ラベル管理

/** 編集モーダル */
export const EditLabelModal: FC<Omit<ModalProps, 'children'> & { target?: TypeLabel; updated: () => void }> = (
  props,
) => {
  const { target, updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    reset,
  } = useForm<EditLabel>({
    resolver: zodResolver(scEditLabel),
    mode: 'onChange',
    defaultValues: { name: '', explanation: '' },
  })

  useEffect(() => {
    setLoading(false)
    reset()
  }, [reset, props.isOpen])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.debug('errors:', errors)
    }
  }, [errors])

  useEffect(() => {
    console.debug('target:', target)
    if (target) {
      setValue('name', target.name)
      setValue('explanation', target.explanation)
    }
  }, [target, props.isOpen, setValue])

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('update:submit:', req)

              setLoading(true)

              // nameの重複チェック
              if (await existsLabelName(req.name)) {
                // 重複チェックエラー
                setError('name', { message: '@already_exists' })
              } else {
                if (target) {
                  await updateLabel(target.id, req)
                } else {
                  await createLabel(req)
                }
                await intervalOperation()
                updated()
                onClose()
              }
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>
              {t(target ? 'item_label_update' : 'item_label_create')}
            </ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='text'
                        label={t('item_label_name')}
                        variant='bordered'
                        errorMessage={fet(errors.name)}
                        onChange={onChange}
                        value={value}
                        isRequired
                      />
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='explanation'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='text'
                        label={t('item_explanation')}
                        variant='bordered'
                        errorMessage={fet(errors.explanation)}
                        onChange={onChange}
                        value={value || ''}
                      />
                    )}
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

/** ラベル作成ボタン */
export const CreateLabelButtonWithModal: FC = () => {
  const { t } = useLocale()
  const editModal = useDisclosure()
  const router = useRouter()
  return (
    <>
      <ExButton
        isIconOnly
        color='primary'
        tooltip={t('item_label_create')}
        onPress={() => {
          editModal.onOpen()
        }}
      >
        <DocumentPlusIcon />
      </ExButton>
      <EditLabelModal
        size='xl'
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        updated={() => {
          router.refresh()
        }}
      />
    </>
  )
}

/** 削除モーダル */
export const DeleteLabelModal: FC<Omit<ModalProps, 'children'> & { target?: TypeLabel; updated: () => void }> = (
  props,
) => {
  const { target, updated, ...nextProps } = props
  const { t } = useLocale()
  const [isAgree, setAgree] = useState(false)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
    setAgree(false)
  }, [props.isOpen])

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>{t('item_delete_confirm')}</ModalHeader>
            <ModalBody className='gap-0'>
              <div className='whitespace-pre-wrap'>{t('msg_user_delete', { username: target?.name })}</div>
              <Checkbox className='mt-4' onChange={() => setAgree(!isAgree)} isSelected={isAgree}>
                {t('item_confirmed')}
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <ExButton color='danger' onPress={onClose}>
                {t('item_cancel')}
              </ExButton>
              <ExButton
                variant='solid'
                startContent={isLoading ? undefined : <CheckIcon />}
                isDisabled={!isAgree}
                isLoading={isLoading}
                onPress={async () => {
                  console.debug('delete:submit:', target)
                  if (target) {
                    setLoading(true)
                    await deleteLabel(target.id)
                    await intervalOperation()
                    setLoading(false)
                    updated()
                    onClose()
                  }
                }}
              >
                {t('item_ok')}
              </ExButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
