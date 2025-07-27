'use client'

import { ConfirmModal, ConfirmModalRef } from '@/components/nextekit/ui/modal'
import { useLocale } from '@/locale/client'
import { FC, ReactNode, createContext, useContext, useRef } from 'react'

const defaultConfirmModalRef: ConfirmModalRef = {
  confirm: async () => false,
  close: () => {},
}
const SharedUIContext = createContext<{
  confirmModal: () => ConfirmModalRef
}>({
  confirmModal: () => defaultConfirmModalRef,
})

export const useSharedUIContext = () => {
  return useContext(SharedUIContext)
}

export const SharedUIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLocale()
  const refModal = useRef<ConfirmModalRef>(defaultConfirmModalRef)

  return (
    <>
      <ConfirmModal
        ref={refModal}
        uiText={{ ok: t('item_ok'), cancel: t('item_cancel'), confirmed: t('item_confirmed') }}
      />
      <SharedUIContext.Provider
        value={{
          confirmModal: () => refModal.current,
        }}
      >
        {children}
      </SharedUIContext.Provider>
    </>
  )
}
