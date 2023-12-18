'use client'

import { CheckIcon, EyeIcon, EyeSlashIcon, UserPlusIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { CreateUser, TypeUser, UpdateUser, scCreateUser, scUpdateUser } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Checkbox,
  Chip,
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
} from '@nextui-org/react'
import { useAsyncList } from '@react-stately/data'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { getLabelList } from '../labels/server-actions'
import { createUser, deleteUser, existsUserName, updateUser } from './server-actions'

// ユーザー管理

/** 作成モーダル */
const CreateUserModal: FC<Omit<ModalProps, 'children'> & { updated: () => void }> = (props) => {
  const { updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const labelList = useAsyncList({
    async load() {
      return { items: await getLabelList() }
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<CreateUser>({
    resolver: zodResolver(scCreateUser),
    mode: 'onChange',
    defaultValues: { name: '', password: '', isAdmin: false, email: '', labelList: new Set([]) },
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

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('create:submit:', req)
              setLoading(true)

              // nameの重複チェック
              if (await existsUserName(req.name)) {
                // 重複チェックエラー
                setError('name', { message: '@already_exists' })
              } else {
                await createUser(req)
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
                  <Controller
                    control={control}
                    name='name'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='text'
                        label={t('item_username')}
                        variant='bordered'
                        errorMessage={fet(errors.name)}
                        onChange={onChange}
                        value={value}
                        autoComplete='username'
                        isRequired
                      />
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='password'
                    render={({ field: { onChange, value } }) => (
                      <Input
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
                        onChange={onChange}
                        value={value}
                        isRequired
                      />
                    )}
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
                  <Controller
                    control={control}
                    name='email'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='text'
                        label={t('item_email')}
                        variant='bordered'
                        errorMessage={fet(errors.email)}
                        onChange={onChange}
                        value={value || ''}
                        autoComplete='email'
                      />
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='labelList'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        items={labelList.items}
                        label='Label'
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
export const UpdateUserModal: FC<Omit<ModalProps, 'children'> & { target?: TypeUser; updated: () => void }> = (
  props,
) => {
  const { target, updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [isUpdatePassword, setUpdatePassword] = useState(false)

  const labelList = useAsyncList({
    async load() {
      return { items: await getLabelList() }
    },
  })

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
    if (Object.keys(errors).length > 0) {
      console.debug('errors:', errors)
    }
  }, [errors])

  useEffect(() => {
    console.debug('target:', target)
    if (target) {
      setValue('name', target.name)
      setValue('isAdmin', target.isAdmin)
      setValue('email', target.email || '')
    }
  }, [target, props.isOpen, setValue])

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('update:submit:', req)
              if (target) {
                setLoading(true)

                // nameの重複チェック
                if (await existsUserName(req.name)) {
                  // 重複チェックエラー
                  setError('name', { message: '@already_exists' })
                } else {
                  await updateUser(target.id, req)
                  await intervalOperation()
                  updated()
                  onClose()
                }
                setLoading(false)
              }
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_user_create')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='name'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='text'
                        label={t('item_username')}
                        variant='bordered'
                        errorMessage={fet(errors.name)}
                        onChange={onChange}
                        value={value}
                        autoComplete='username'
                        isRequired
                      />
                    )}
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
                  <Controller
                    control={control}
                    name='password'
                    render={({ field: { onChange, value } }) => (
                      <Input
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
                        onChange={onChange}
                        value={value}
                        isDisabled={!isUpdatePassword}
                        isRequired
                      />
                    )}
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
                  <Controller
                    control={control}
                    name='email'
                    render={({ field: { onChange, value } }) => (
                      <Input
                        type='text'
                        label={t('item_email')}
                        variant='bordered'
                        errorMessage={fet(errors.email)}
                        onChange={onChange}
                        value={value || ''}
                        autoComplete='email'
                      />
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={control}
                    name='labelList'
                    render={({ field: { onChange, value } }) => (
                      <Select
                        items={labelList.items}
                        label='Label'
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
export const CreateUserButtonWithModal: FC<{ updated: () => void }> = ({ updated }) => {
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
      />
    </>
  )
}

/** 削除モーダル */
export const DeleteUserModal: FC<Omit<ModalProps, 'children'> & { target?: TypeUser; updated: () => void }> = (
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
                    await deleteUser(target.id)
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
