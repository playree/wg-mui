'use client'

import { ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon, GitLabIcon, GoogleIcon } from '@/components/icons'
import { InputCtrl } from '@/components/nextekit/ui/input'
import { Message } from '@/components/nextekit/ui/message'
import { gridStyles, textStyles } from '@/components/styles'
import { scSignin, Signin } from '@/helpers/schema'
import { useLocale } from '@/locale/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, CardBody, CardHeader } from "@heroui/react"
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { twMerge } from 'tailwind-merge'

import { parseAction } from '@/helpers/action'
import { deleteSessionToken, SSResource } from './server-actions'

export const SignInClient: FC<{ ssr: SSResource; isError: boolean }> = ({
  ssr: { isGoogleEnabled, isGitLabEnabled, signinMessage },
  isError,
}) => {
  const { t, fet, lvt } = useLocale()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || undefined
  const router = useRouter()
  const [isAuthNg, setIsAuthNg] = useState(false)

  const [isVisible, setIsVisible] = useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const isOnlyPassword = useCallback((callbackUrl?: string) => {
    if (!callbackUrl) {
      return false
    }
    try {
      const url = new URL(callbackUrl)
      return url.pathname.indexOf('/oauth/') === 0
    } catch {
      return false
    }
  }, [])

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Signin>({
    resolver: zodResolver(scSignin),
    mode: 'onChange',
    defaultValues: { username: '', password: '' },
  })

  useEffect(() => {
    if (isError) {
      setIsAuthNg(true)
      parseAction(deleteSessionToken())
    }
  }, [isError])

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
        {isAuthNg && <Message variant='error'>{t('@invalid_authentication_failed')}</Message>}
        <form className={gridStyles()} onSubmit={handleSubmit(onSubmit)}>
          <div className='col-span-12 p-2'>
            <InputCtrl
              control={control}
              name='username'
              autoFocus
              label={t('item_username_email')}
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
          <div className='col-span-12 pt-2 text-center'>
            <Button type='submit' color='primary'>
              <ArrowLeftOnRectangleIcon />
              {t('item_signin')}
            </Button>
          </div>
          {isGoogleEnabled && !isOnlyPassword(callbackUrl) && (
            <div className='col-span-12 pt-2 text-center'>
              <Button variant='ghost' color='default' onPress={() => signIn('google', { callbackUrl })}>
                <GoogleIcon />
                {t('item_google_signin')}
              </Button>
            </div>
          )}
          {isGitLabEnabled && !isOnlyPassword(callbackUrl) && (
            <div className='col-span-12 pt-2 text-center'>
              <Button variant='ghost' color='default' onPress={() => signIn('gitlab', { callbackUrl })}>
                <GitLabIcon />
                {t('item_gitlab_signin')}
              </Button>
            </div>
          )}
          <ReactMarkdown
            className={twMerge(textStyles({ color: 'light' }), 'markdown col-span-12 p-2')}
            remarkPlugins={[remarkGfm]}
          >
            {lvt(signinMessage)}
          </ReactMarkdown>
        </form>
      </CardBody>
    </Card>
  )
}
