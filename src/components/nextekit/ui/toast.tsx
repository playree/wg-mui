'use client'

import { textStyles } from '@/components/styles'
import { IconSvgProps } from '@/types'
import { Button } from '@nextui-org/react'
import { AnimatePresence, motion } from 'framer-motion'
import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type ToastMessage = {
  id: string
  type: 'info' | 'error'
  message: string
}

export type ToastRef = {
  info: (msg: Omit<ToastMessage, 'id' | 'type'>) => void
  error: (msg: Omit<ToastMessage, 'id' | 'type'>) => void
}

const XMarkIcon: FC<IconSvgProps> = ({ size = 20, strokeWidth = 2, ...props }) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      clipRule='evenodd'
      fillRule='evenodd'
      d='M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z'
    />
  </svg>
)

const InformationCircleIcon: FC<IconSvgProps> = ({ size = 20, strokeWidth = 2, ...props }) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      clipRule='evenodd'
      fillRule='evenodd'
      d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
    />
  </svg>
)

const ExclamationTriangleIcon: FC<IconSvgProps> = ({ size = 20, strokeWidth = 2, ...props }) => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={size}
    strokeWidth={strokeWidth}
    {...props}
  >
    <path
      clipRule='evenodd'
      fillRule='evenodd'
      d='M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z'
    />
  </svg>
)

export const Toast = forwardRef<ToastRef>((props, ref) => {
  const [messageList, setMessageList] = useState<ToastMessage[]>([])
  const tid = useRef<NodeJS.Timeout>(undefined)

  useEffect(() => {
    tid.current = setTimeout(() => {
      if (messageList.length > 0) {
        messageList.shift()
        setMessageList([...messageList])
      }
    }, 3000)
    return () => {
      if (tid.current) {
        clearTimeout(tid.current)
      }
    }
  }, [messageList])

  useImperativeHandle(ref, () => ({
    info: (msg) => {
      setMessageList([...messageList, { ...msg, id: window.crypto.randomUUID(), type: 'info' }])
    },
    error: (msg) => {
      setMessageList([...messageList, { ...msg, id: window.crypto.randomUUID(), type: 'error' }])
    },
  }))

  const removeToast = (id: string) => {
    setMessageList(messageList.filter((value) => value.id !== id))
  }

  return (
    <div
      className={twMerge('fixed bottom-1 right-1 flex max-w-96 flex-col flex-wrap-reverse text-right')}
      style={{ zIndex: 99 }}
    >
      <AnimatePresence>
        {messageList.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ y: 40, opacity: 1 }}
            animate={{ y: 0 }}
            exit={{ opacity: 0 }}
            className={twMerge(
              'relative z-20 mt-2 flex w-fit items-center text-sm',
              msg.type === 'error'
                ? 'rounded-lg bg-red-100 p-2 text-red-500 opacity-80 shadow dark:bg-red-950 dark:text-red-300'
                : 'rounded-lg bg-blue-100 p-2 text-gray-500 opacity-80 shadow dark:bg-gray-800 dark:text-gray-400',
            )}
          >
            {msg.type === 'error' ? (
              <ExclamationTriangleIcon className='mr-1' />
            ) : (
              <InformationCircleIcon className='mr-1' />
            )}
            <div>{msg.message}</div>
            <Button
              isIconOnly
              variant='flat'
              size='sm'
              className={twMerge(textStyles({ color: 'light' }), 'ml-2')}
              onClick={() => {
                removeToast(msg.id)
              }}
            >
              <XMarkIcon size={16} />
            </Button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
})
Toast.displayName = 'Toast'
