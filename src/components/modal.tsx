'use client'

import { Checkbox, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalProps } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'

import { CheckIcon } from './icons'
import { ExButton } from './nextekit/ui/button'

// 削除モーダル
export const DeleteModal: FC<ModalProps & { run: () => void }> = (props) => {
  const { children, run, ...nextProps } = props
  const [isAgree, setAgree] = useState(false)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
    setAgree(false)
  }, [props.isOpen])

  return (
    <Modal {...nextProps}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-1'>削除確認</ModalHeader>
            <ModalBody className='gap-0'>
              {children}
              <Checkbox className='mt-4' onChange={() => setAgree(!isAgree)} isSelected={isAgree}>
                削除する
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <ExButton color='danger' onPress={onClose}>
                キャンセル
              </ExButton>
              <ExButton
                variant='solid'
                startContent={isLoading ? undefined : <CheckIcon />}
                isDisabled={!isAgree}
                isLoading={isLoading}
                onPress={async (req) => {
                  console.debug('update:submit:', req)
                  setLoading(true)
                  run()
                }}
              >
                削除
              </ExButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  )
}
