'use client'

import { CheckIcon, EyeIcon, EyeSlashIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { PasswordScore } from '@/components/password-score'
import { gridStyles } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { UpdatePassword, scUpdatePassword } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalProps } from '@nextui-org/react'
import { zxcvbn } from '@zxcvbn-ts/core'
import { FC, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { updatePassword } from './server-actions'

export const ChangePasswordModal: FC<
  Omit<ModalProps, 'children'> & { target?: string; updated: () => void; requiredPasswordScore: number }
> = (props) => {
  const { target, updated, requiredPasswordScore, ...nextProps } = props
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [passwordScore, setPasswordScore] = useState(0)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm<UpdatePassword>({
    resolver: zodResolver(scUpdatePassword),
    mode: 'onChange',
    defaultValues: { id: '', password: '' },
  })

  useEffect(() => {
    setLoading(false)
    reset()
    setPasswordScore(0)
  }, [reset, props.isOpen])

  useEffect(() => {
    console.debug('target:', target)
    if (target) {
      setValue('id', target)
    }
  }, [target, props.isOpen, setValue])

  return (
    <Modal backdrop='blur' {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <form
            onSubmit={handleSubmit(async (req) => {
              console.debug('update:submit:', req)
              setLoading(true)
              // パスワードスコアチェック
              if (req.password) {
                if (passwordScore < requiredPasswordScore) {
                  setError('password', { message: '@invalid_password_score' })
                  setLoading(false)
                  return
                }
              }

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
                    isRequired
                    onChanged={(event) => {
                      const res = zxcvbn(event.target.value)
                      setPasswordScore(res.score)
                    }}
                  />
                  <PasswordScore
                    label={`${t('item_password_score')} = ${passwordScore} ( ${t('msg_password_score_required', { score: requiredPasswordScore })}`}
                    score={passwordScore}
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
