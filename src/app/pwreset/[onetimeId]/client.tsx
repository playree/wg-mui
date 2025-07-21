'use client'

import { CheckIcon, Cog6ToothIcon, EyeIcon, EyeSlashIcon } from '@/components/icons'
import { LangSwitch } from '@/components/lang-switch'
import { ExButton } from '@/components/nextekit/ui/button'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { PasswordScore } from '@/components/password-score'
import { gridStyles } from '@/components/styles'
import { ThemeSwitchList } from '@/components/theme-switch'
import { parseAction } from '@/helpers/action'
import { UpdatePassword, scUpdatePassword } from '@/helpers/schema'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { zxcvbn } from '@zxcvbn-ts/core'
import { useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import { resetPassword } from './server-actions'

export const PasswordResetClient: FC<{ onetimeId: string; requiredPasswordScore: number }> = ({
  onetimeId,
  requiredPasswordScore,
}) => {
  const { t, fet } = useLocale()
  const [isLoading, setLoading] = useState(false)
  const router = useRouter()

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const [passwordScore, setPasswordScore] = useState(0)

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UpdatePassword>({
    resolver: zodResolver(scUpdatePassword),
    mode: 'onChange',
    defaultValues: {
      id: onetimeId,
      password: '',
    },
  })

  return (
    <div className='mx-auto mt-4 w-full max-w-xl'>
      <div className='mb-4 flex items-center pl-8 lg:pl-0'>
        <Cog6ToothIcon className='mr-2' />
        <span className='mr-8 text-lg'>{t('menu_password_reset')}</span>
        <div className='right-0 flex flex-auto justify-end'>
          <ThemeSwitchList size='sm' className='mr-2' />
          <LangSwitch size='sm' />
        </div>
      </div>
      <form
        onSubmit={handleSubmit(async (req) => {
          console.debug('create:submit:', req)
          setLoading(true)
          // パスワードスコアチェック
          if (req.password) {
            if (passwordScore < requiredPasswordScore) {
              setError('password', { message: '@invalid_password_score' })
              setLoading(false)
              return
            }
          }

          await parseAction(resetPassword(req))
          await intervalOperation()
          setLoading(false)
          router.replace('/')
        })}
      >
        <div className={gridStyles()}>
          <div className='col-span-12 mb-2 whitespace-pre-line'>{t('msg_password_reset')}</div>
          <div className='col-span-12'>
            <input name='username' autoComplete='username' hidden />
            <InputCtrl
              control={control}
              name='password'
              label={t('item_password')}
              variant='bordered'
              endContent={
                <button className='focus:outline-hidden' type='button' onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeSlashIcon className='text-default-400 pointer-events-none text-2xl' />
                  ) : (
                    <EyeIcon className='text-default-400 pointer-events-none text-2xl' />
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

          <div className='col-span-12 mt-4 text-center'>
            <ExButton type='submit' variant='solid' startContent={<CheckIcon />} isLoading={isLoading}>
              {t('item_ok')}
            </ExButton>
          </div>
        </div>
      </form>
    </div>
  )
}
