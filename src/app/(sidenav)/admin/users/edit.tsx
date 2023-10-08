'use client'

import { CheckIcon, EyeIcon, EyeSlashIcon, UserPlusIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { CreateUser, scCreateUser } from '@/helpers/schema'
import { sleep } from '@/helpers/sleep'
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

import { createUser } from './server-action'

// ユーザー管理

/** 作成モーダル */
export const EditModal: FC<Omit<ModalProps, 'children'> & { update: () => void }> = (props) => {
  const { update, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUser>({
    resolver: zodResolver(scCreateUser),
    mode: 'onChange',
    defaultValues: { name: '', password: '', isAdmin: false, email: '' },
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
              await createUser(req)
              await sleep(500)
              setLoading(false)
              update()
              onClose()
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

export const UserAdd: FC = () => {
  const { t } = useLocale()
  const editModal = useDisclosure()
  const router = useRouter()
  return (
    <>
      <ExButton
        isIconOnly
        color='primary'
        tooltip={t('item_user_create')}
        onPress={() => {
          editModal.onOpen()
        }}
      >
        <UserPlusIcon />
      </ExButton>
      <EditModal
        size='xl'
        isOpen={editModal.isOpen}
        onOpenChange={editModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        update={() => {
          router.refresh()
        }}
      />
    </>
  )
}
