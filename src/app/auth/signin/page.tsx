'use client'

import { ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon } from '@/components/icons'
import { Message } from '@/components/nextekit/ui/Message'
import { gridStyles } from '@/components/styles'
import { TypeSignin, scSignin } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@nextui-org/button'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { Input } from '@nextui-org/input'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { FC, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

const SignIn: FC = () => {
  const { t, fet } = useLocale()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const error = searchParams.get('error')
  console.debug('callbackUrl:', callbackUrl)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TypeSignin>({ resolver: zodResolver(scSignin), mode: 'onChange' })

  const onSubmit: SubmitHandler<TypeSignin> = async (data) => {
    console.debug('SignIn:submit:', data)
    await signIn('credentials', {
      redirect: true,
      callbackUrl: callbackUrl || '/',
      username: data.username,
      password: data.password,
    })
  }

  return (
    <Card className='m-auto w-full max-w-md'>
      <CardHeader>
        <ArrowLeftOnRectangleIcon className='mr-2' />
        {t('item_signin')}
      </CardHeader>
      <CardBody>
        {error && <Message variant='error'>{t('@invalid_username_or_password')}</Message>}
        <form className={gridStyles()} onSubmit={handleSubmit(onSubmit)}>
          <div className='col-span-12 p-2'>
            <Input
              type='text'
              label={t('item_username')}
              variant='bordered'
              autoComplete='username'
              errorMessage={fet(errors.username)}
              {...register('username')}
            />
          </div>
          <div className='col-span-12 p-2'>
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
              autoComplete='current-password'
              errorMessage={fet(errors.password)}
              {...register('password')}
            />
          </div>
          <div className='col-span-12 p-2 text-center'>
            <Button type='submit' color='primary'>
              <ArrowLeftOnRectangleIcon />
              {t('item_signin')}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
export default SignIn
