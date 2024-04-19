'use client'

import { textStyles } from '@/components/styles'
import { Button } from '@nextui-org/react'
import { motion } from 'framer-motion'
import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { twMerge } from 'tailwind-merge'

type ToastMessage = {
  id: string
  message: string
}

export type ToastRef = {
  show: (msg: Omit<ToastMessage, 'id'>) => void
}

const XMarkIcon: FC = () => (
  <svg
    fill='currentColor'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    width={20}
    strokeWidth={2}
  >
    <path
      clipRule='evenodd'
      fillRule='evenodd'
      d='M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z'
    />
  </svg>
)

export const Toast = forwardRef<ToastRef>((props, ref) => {
  const [messageList, setMessageList] = useState<ToastMessage[]>([])
  const tid = useRef<NodeJS.Timeout>()

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
    show: (msg) => {
      setMessageList([...messageList, { ...msg, id: window.crypto.randomUUID() }])
    },
  }))

  const removeToast = (id: string) => {
    setMessageList(messageList.filter((value) => value.id !== id))
  }

  return (
    <div className='fixed bottom-1 right-1 flex max-w-80 flex-col flex-wrap-reverse text-right' style={{ zIndex: 99 }}>
      {messageList.map((msg) => (
        <motion.div
          initial={{ y: 40 }}
          animate={{ y: 0 }}
          key={msg.id}
          className={twMerge(
            'relative z-20 mt-2 flex w-fit items-center text-sm',
            'rounded-lg bg-blue-100 py-2 pl-4 pr-2 text-gray-500 opacity-80 shadow dark:bg-gray-800 dark:text-gray-400',
          )}
        >
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
            <XMarkIcon />
          </Button>
        </motion.div>
      ))}
    </div>
  )
})
Toast.displayName = 'Toast'
