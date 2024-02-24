'use client'

import { CheckIcon, DocumentPlusIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { CreateLabel, TypeLabel, UpdateLabel, scCreateLabel, scUpdateLabel } from '@/helpers/schema'
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
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createLabel, deleteLabel, existsLabelName, updateLabel } from './server-actions'

// ラベル管理

/** 作成モーダル */
export const CreateLabelModal: FC<Omit<ModalProps, 'children'> & { updated: () => void }> = (props) => {
  const { updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<CreateLabel>({
    resolver: zodResolver(scCreateLabel),
    mode: 'onChange',
    defaultValues: { name: '', explanation: '' },
  })

  useEffect(() => {
    setLoading(false)
    reset()
  }, [reset, props.isOpen])

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('update:submit:', req)
              setLoading(true)
              // nameの重複チェック
              const exist = await parseAction(existsLabelName({ name: req.name }))
              if (exist) {
                // 重複チェックエラー
                setError('name', { message: '@already_exists' })
              } else {
                await parseAction(createLabel(req))
                await intervalOperation()
                updated()
                onClose()
              }
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_label_create')}</ModalHeader>
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

/** 更新モーダル */
export const UpdateLabelModal: FC<Omit<ModalProps, 'children'> & { target?: TypeLabel; updated: () => void }> = (
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
  } = useForm<UpdateLabel>({
    resolver: zodResolver(scUpdateLabel),
    mode: 'onChange',
    defaultValues: { id: '', name: '', explanation: '' },
  })

  useEffect(() => {
    setLoading(false)
    reset()
  }, [reset, props.isOpen])

  useEffect(() => {
    console.debug('target:', target?.id)
    if (target) {
      setValue('id', target.id)
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
              const exist = await parseAction(existsLabelName({ name: req.name, excludeId: req.id }))
              if (exist) {
                // 重複チェックエラー
                setError('name', { message: '@already_exists' })
              } else {
                await parseAction(updateLabel(req))
                await intervalOperation()
                updated()
                onClose()
              }
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_label_update')}</ModalHeader>
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
export const CreateLabelButtonWithModal: FC<{ updated: () => void }> = ({ updated }) => {
  const { t } = useLocale()
  const editModal = useDisclosure()
  return (
    <>
      <ExButton isIconOnly color='primary' tooltip={t('item_label_create')} onPress={() => editModal.onOpen()}>
        <DocumentPlusIcon />
      </ExButton>
      <CreateLabelModal
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
                    await parseAction(deleteLabel({ id: target.id }))
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
