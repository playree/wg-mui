'use client'

import { Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalProps } from '@nextui-org/react'
import { FC, forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { ExButton } from './button'

const CheckIcon: FC = () => (
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
      d='M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z'
    />
  </svg>
)

type ConfirmParam = { title: string; text: string; requireCheck?: boolean; autoClose?: boolean; onlyOk?: boolean }

export type ConfirmModalRef = {
  confirm: (param: ConfirmParam) => Promise<boolean>
  close: () => void
}

export const ConfirmModal = forwardRef<
  ConfirmModalRef,
  Omit<ModalProps, 'children'> & { uiText?: { ok?: string; cancel?: string; confirmed?: string } }
>((props, ref) => {
  const { uiText, ...nextProps } = props
  const [confirmParam, setConfirmParam] = useState<ConfirmParam>()
  const response = useRef<(value: boolean | PromiseLike<boolean>) => void>()
  const [isAgree, setAgree] = useState(false)
  const [isLoading, setLoading] = useState(false)

  useImperativeHandle(ref, () => ({
    confirm: (param) => {
      setLoading(false)
      setAgree(!param.requireCheck)
      setConfirmParam(param)
      return new Promise((resolve) => {
        response.current = resolve
      })
    },
    close: () => {
      setConfirmParam(undefined)
    },
  }))

  return (
    <Modal
      size='xl'
      isOpen={!!confirmParam}
      onOpenChange={(open) => {
        if (!open) {
          if (confirmParam) {
            setConfirmParam(undefined)
          }
        }
      }}
      isDismissable={false}
      scrollBehavior='outside'
      backdrop='blur'
      {...nextProps}
    >
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1'>{confirmParam?.title || ''}</ModalHeader>
        <ModalBody className='gap-0'>
          <div className='whitespace-pre-wrap'>{confirmParam?.text || ''}</div>
          {confirmParam?.requireCheck && (
            <Checkbox className='mt-4' onChange={() => setAgree(!isAgree)} isSelected={isAgree}>
              {uiText?.confirmed || 'Confirmed'}
            </Checkbox>
          )}
        </ModalBody>
        <ModalFooter>
          {!confirmParam?.onlyOk && (
            <ExButton
              color='danger'
              onPress={() => {
                if (response.current) {
                  response.current(false)
                  response.current = undefined
                }
                setConfirmParam(undefined)
              }}
            >
              {uiText?.cancel || 'Cancel'}
            </ExButton>
          )}
          <ExButton
            variant='solid'
            startContent={<CheckIcon />}
            isDisabled={!isAgree}
            isLoading={isLoading}
            onPress={async () => {
              if (response.current) {
                response.current(true)
                response.current = undefined
              }
              if (confirmParam?.autoClose === false) {
                setLoading(true)
              } else {
                setConfirmParam(undefined)
              }
            }}
          >
            {uiText?.ok || 'OK'}
          </ExButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
})
ConfirmModal.displayName = 'ConfirmModal'
