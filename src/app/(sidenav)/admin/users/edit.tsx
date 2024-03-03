'use client'

import { CheckIcon, EyeIcon, EyeSlashIcon, UserPlusIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { CreateUser, TypeLabel, TypeUser, UpdateUser, scCreateUser, scUpdateUser } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Checkbox,
  Chip,
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
import { AsyncListData } from '@react-stately/data'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { createUser, existsUserName, updateUser } from './server-actions'

// ユーザー管理

/** 作成モーダル */
const CreateUserModal: FC<
  Omit<ModalProps, 'children'> & { updated: () => void; labelList: AsyncListData<TypeLabel> }
> = (props) => {
  const { updated, labelList, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [isSendEmail, setSendEmail] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
  } = useForm<CreateUser>({
    resolver: zodResolver(scCreateUser),
    mode: 'onChange',
    defaultValues: { name: '', password: '', isAdmin: false, email: '', labelList: new Set([]) },
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
              console.debug('create:submit:', req)
              setLoading(true)
              // nameの重複チェック
              const exist = await parseAction(existsUserName({ name: req.name }))
              if (exist) {
                // 重複チェックエラー
                setError('name', { message: '@already_exists' })
              } else {
                await parseAction(createUser(req))
                await intervalOperation()
                updated()
                onClose()
              }
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_user_create')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <InputCtrl
                    control={control}
                    name='name'
                    label={t('item_username')}
                    variant='bordered'
                    errorMessage={fet(errors.name)}
                    autoComplete='username'
                    isRequired
                  />
                </div>
                <div className='col-span-12 flex items-center pl-2'>
                  <Checkbox
                    className='pl-2'
                    onChange={() => {
                      setSendEmail(!isSendEmail)
                      setValue('password', '')
                      control.setError('password', { message: undefined })
                    }}
                    isSelected={isSendEmail}
                  >
                    {t('item_send_email_password')}
                  </Checkbox>
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
                    isDisabled={isSendEmail}
                    isRequired
                  />
                </div>
                <div className='col-span-12 pl-2'>
                  <Controller
                    control={control}
                    name='isAdmin'
                    render={({ field: { onChange, value } }) => (
                      <Checkbox onChange={onChange} isSelected={value}>
                        {t('item_isadmin')}
                      </Checkbox>
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <InputCtrl
                    control={control}
                    name='email'
                    label={t('item_email')}
                    variant='bordered'
                    errorMessage={fet(errors.email)}
                    autoComplete='email'
                    isRequired={isSendEmail}
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='labelList'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        items={labelList.items}
                        label={t('item_label')}
                        variant='bordered'
                        isMultiline={true}
                        selectionMode='multiple'
                        onSelectionChange={onChange}
                        selectedKeys={value}
                        renderValue={(items) => {
                          return (
                            <div className='flex flex-wrap gap-2'>
                              {items.map((item) => (
                                <Chip key={item.key}>{item.data?.name}</Chip>
                              ))}
                            </div>
                          )
                        }}
                      >
                        {(label) => (
                          <SelectItem key={label.id} textValue={label.name}>
                            <span className='text-small'>{label.name}</span>
                          </SelectItem>
                        )}
                      </Select>
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
export const UpdateUserModal: FC<
  Omit<ModalProps, 'children'> & { target?: TypeUser; updated: () => void; labelList: AsyncListData<TypeLabel> }
> = (props) => {
  const { target, updated, labelList, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [isUpdatePassword, setUpdatePassword] = useState(false)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    reset,
  } = useForm<UpdateUser>({
    resolver: zodResolver(scUpdateUser),
    mode: 'onChange',
    defaultValues: { name: '', password: '', isAdmin: false, email: '', labelList: new Set([]) },
  })

  useEffect(() => {
    setLoading(false)
    reset()
    setUpdatePassword(false)
  }, [reset, props.isOpen])

  useEffect(() => {
    console.debug('target:', target?.id)
    if (target) {
      setValue('id', target.id)
      setValue('name', target.name)
      setValue('isAdmin', target.isAdmin)
      setValue('email', target.email || '')
      setValue('labelList', new Set(target.labelList?.map((value) => value.id)))
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
              const exist = await parseAction(existsUserName({ name: req.name, excludeId: req.id }))
              if (exist) {
                // 重複チェックエラー
                setError('name', { message: '@already_exists' })
              } else {
                await parseAction(updateUser(req))
                await intervalOperation()
                updated()
                onClose()
              }
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_user_update')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <InputCtrl
                    control={control}
                    name='name'
                    label={t('item_username')}
                    variant='bordered'
                    errorMessage={fet(errors.name)}
                    autoComplete='username'
                    isRequired
                  />
                </div>
                <div className='col-span-5 flex items-center pl-2'>
                  <Checkbox
                    className='pl-2'
                    onChange={() => {
                      setUpdatePassword(!isUpdatePassword)
                      setValue('password', '')
                      control.setError('password', { message: undefined })
                    }}
                    isSelected={isUpdatePassword}
                  >
                    {t('item_change_password')}
                  </Checkbox>
                </div>
                <div className='col-span-7'>
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
                    isDisabled={!isUpdatePassword}
                    isRequired
                  />
                </div>
                <div className='col-span-12 pl-2'>
                  <Controller
                    control={control}
                    name='isAdmin'
                    render={({ field: { onChange, value } }) => (
                      <Checkbox onChange={onChange} isSelected={value}>
                        {t('item_isadmin')}
                      </Checkbox>
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <InputCtrl
                    control={control}
                    name='email'
                    label={t('item_email')}
                    variant='bordered'
                    errorMessage={fet(errors.email)}
                    autoComplete='email'
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='labelList'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        items={labelList.items}
                        label={t('item_label')}
                        variant='bordered'
                        isMultiline={true}
                        selectionMode='multiple'
                        onSelectionChange={onChange}
                        selectedKeys={value}
                        renderValue={(items) => {
                          return (
                            <div className='flex flex-wrap gap-2'>
                              {items.map((item) => (
                                <Chip key={item.key}>{item.data?.name}</Chip>
                              ))}
                            </div>
                          )
                        }}
                      >
                        {(label) => (
                          <SelectItem key={label.id} textValue={label.name}>
                            <span className='text-small'>{label.name}</span>
                          </SelectItem>
                        )}
                      </Select>
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

/** ユーザー作成ボタン */
export const CreateUserButtonWithModal: FC<{ updated: () => void; labelList: AsyncListData<TypeLabel> }> = ({
  updated,
  labelList,
}) => {
  const { t } = useLocale()
  const editModal = useDisclosure()
  return (
    <>
      <ExButton isIconOnly color='primary' tooltip={t('item_user_create')} onPress={() => editModal.onOpen()}>
        <UserPlusIcon />
      </ExButton>
      <CreateUserModal
        size='xl'
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        updated={() => updated()}
        labelList={labelList}
      />
    </>
  )
}
