'use client'

import { ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon, GoogleIcon } from '@/components/icons'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { Message } from '@/components/nextekit/ui/message'
import { gridStyles } from '@/components/styles'
import { Signin, scSignin } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export const SignInClient: FC<{ isGoogleEnabled: boolean }> = ({ isGoogleEnabled }) => {
  const { t, fet } = useLocale()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || undefined
  const router = useRouter()
  const [isAuthNg, setIsAuthNg] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Signin>({
    resolver: zodResolver(scSignin),
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
  })

  const onSubmit: SubmitHandler<Signin> = async (data) => {
    console.debug('SignIn:submit:', data)
    await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    }).then((res) => {
      console.debug('signIn:', res)
      if (!res?.error) {
        router.push(callbackUrl || '')
      } else {
        setIsAuthNg(true)
      }
    })
  }

  return (
    <Card className='m-auto w-full max-w-md'>
      <CardHeader>
        <ArrowLeftOnRectangleIcon className='mr-2' />
        {t('item_signin')}
      </CardHeader>
      <CardBody>
        {isAuthNg && <Message variant='error'>{t('@invalid_username_or_password')}</Message>}
        <form className={gridStyles()} onSubmit={handleSubmit(onSubmit)}>
          <div className='col-span-12 p-2'>
            <InputCtrl
              control={control}
              name='username'
              autoFocus
              label={t('item_username')}
              autoComplete='username'
              errorMessage={fet(errors.username)}
            />
          </div>
          <div className='col-span-12 p-2'>
            <InputCtrl
              control={control}
              name='password'
              label={t('item_password')}
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
              autoComplete='current-password'
              errorMessage={fet(errors.password)}
            />
          </div>
          <div className='col-span-12 p-2 text-center'>
            <Button type='submit' color='primary'>
              <ArrowLeftOnRectangleIcon />
              {t('item_signin')}
            </Button>
          </div>
          {isGoogleEnabled && (
            <div className='col-span-12 p-2 text-center'>
              <Button variant='ghost' color='default' onPress={() => signIn('google', { callbackUrl })}>
                <GoogleIcon />
                {t('item_google_signin')}
              </Button>
            </div>
          )}
        </form>
      </CardBody>
    </Card>
  )
}
