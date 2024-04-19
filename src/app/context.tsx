'use client'

import { ConfirmModal, ConfirmModalRef } from '@/components/nextekit/ui/modal'
import { Toast, ToastRef } from '@/components/nextekit/ui/toast'
import { useLocale } from '@/locale/client'
import { FC, ReactNode, createContext, useContext, useRef } from 'react'

const defaultConfirmModalRef: ConfirmModalRef = {
  confirm: async () => false,
  close: () => {},
}
const defaultToastRef: ToastRef = {
  show: () => {},
}
const SharedUIContext = createContext<{
  confirmModal: () => ConfirmModalRef
  toast: () => ToastRef
}>({
  confirmModal: () => defaultConfirmModalRef,
  toast: () => defaultToastRef,
})

export const useSharedUIContext = () => {
  return useContext(SharedUIContext)
}

export const SharedUIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useLocale()
  const refModal = useRef<ConfirmModalRef>(defaultConfirmModalRef)
  const refToast = useRef<ToastRef>(defaultToastRef)

  return (
    <>
      <Toast ref={refToast} />
      <ConfirmModal
        ref={refModal}
        uiText={{ ok: t('item_ok'), cancel: t('item_cancel'), confirmed: t('item_confirmed') }}
      />
      <SharedUIContext.Provider
        value={{
          confirmModal: () => refModal.current,
          toast: () => refToast.current,
        }}
      >
        {children}
      </SharedUIContext.Provider>
    </>
  )
}
