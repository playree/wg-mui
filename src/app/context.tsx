'use client'

import { ConfirmModal, ConfirmModalRef } from '@/components/nextekit/ui/modal'
import { useLocale } from '@/locale'
import { FC, ReactNode, RefObject, createContext, useContext, useRef } from 'react'

const SharedUIContext = createContext<{ confirmModal: RefObject<ConfirmModalRef> | null }>({
  confirmModal: null,
})

export const useSharedUIContext = () => {
  return useContext(SharedUIContext)
}

export const SharedUIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLocale()
  const refModal = useRef<ConfirmModalRef>(null)

  return (
    <>
      <ConfirmModal
        ref={refModal}
        uiText={{ ok: t('item_ok'), cancel: t('item_cancel'), confirmed: t('item_confirmed') }}
      />
      <SharedUIContext.Provider
        value={{
          confirmModal: refModal,
        }}
      >
        {children}
      </SharedUIContext.Provider>
    </>
  )
}
