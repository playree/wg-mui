'use client'

import { CheckIcon, EyeIcon, EyeSlashIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { UpdatePassword, scUpdatePassword } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalProps } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { updatePassword } from './server-actions'

export const ChangePasswordModal: FC<Omit<ModalProps, 'children'> & { target?: string; updated: () => void }> = (
  props,
) => {
  const { target, updated, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdatePassword>({
    resolver: zodResolver(scUpdatePassword),
    mode: 'onChange',
    defaultValues: { id: '', password: '' },
  })

  useEffect(() => {
    setLoading(false)
    reset()
  }, [reset, props.isOpen])

  useEffect(() => {
    console.debug('target:', target)
    if (target) {
      setValue('id', target)
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
              await parseAction(updatePassword(req))
              await intervalOperation()
              updated()
              onClose()
              setLoading(false)
            })}
          >
            <ModalHeader className='flex flex-col gap-1'>{t('item_change_password')}</ModalHeader>
            <ModalBody>
              <div className={gridStyles()}>
                <div className='col-span-12'>
                  <input name='username' autoComplete='username' hidden />
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
