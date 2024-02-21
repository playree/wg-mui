'use client'

import { KeyIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { gridStyles, iconSizes } from '@/components/styles'
import { dayformat } from '@/helpers/day'
import { TypeUser } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { Card, CardBody, Divider, useDisclosure } from '@nextui-org/react'
import { FC, useEffect, useState } from 'react'

import { ChangePasswordModal } from './edit'

export const Title: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_account')}</span>
}

export const AccountViewClient: FC<{ account: TypeUser }> = ({ account }) => {
  const { t } = useLocale()

  const [targetChangePwd, setTargetChangePwd] = useState<string>()
  const changePwdModal = useDisclosure()
  const openChangePwdModal = changePwdModal.onOpen

  useEffect(() => {
    console.debug('targetChangePwd:', targetChangePwd)
    if (targetChangePwd) {
      openChangePwdModal()
    }
  }, [openChangePwdModal, targetChangePwd])

  return (
    <>
      <Card className='w-full'>
        <CardBody className={gridStyles()}>
          <div className='col-span-3'>{t('item_username')}</div>
          <div className='col-span-7'>{account.name}</div>
          <div className='col-span-2'></div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_password')}</div>
          <div className='col-span-7'>
            <ExButton isSmart onPress={() => setTargetChangePwd(account.id)}>
              <KeyIcon size={iconSizes.sm} />
              {t('item_change_password')}
            </ExButton>
          </div>
          <div className='col-span-2'></div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_isadmin')}</div>
          <div className='col-span-7'>
            <OnOffChip isEnable={account.isAdmin} messageOn={t('item_true')} messageOff={t('item_false')} />
          </div>
          <div className='col-span-2'></div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_email')}</div>
          <div className='col-span-7'>{account.email}</div>
          <div className='col-span-2'></div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_updated_at')}</div>
          <div className='col-span-7'>{dayformat(account.updatedAt, 'jp-simple')}</div>
          <div className='col-span-2'></div>
        </CardBody>
      </Card>
      <ChangePasswordModal
        size='xl'
        isOpen={changePwdModal.isOpen}
        onOpenChange={changePwdModal.onOpenChange}
        isDismissable={false}
        scrollBehavior='outside'
        target={targetChangePwd}
        updated={() => {}}
        onClose={() => setTargetChangePwd(undefined)}
      />
    </>
  )
}
