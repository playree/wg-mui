'use client'

import { useSharedUIContext } from '@/app/context'
import { BoltSlashIcon, KeyIcon, PencilSquareIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { OnOffChip } from '@/components/nextekit/ui/chip'
import { gridStyles, iconSizes } from '@/components/styles'
import { parseAction } from '@/helpers/action'
import { dayformat } from '@/helpers/day'
import { intervalOperation } from '@/helpers/sleep'
import { useLocale } from '@/locale/client'
import { Card, CardBody, Divider, useDisclosure } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

import { ChangePasswordModal } from './edit'
import { Account, unlinkOAuth } from './server-actions'

export const Title: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_account')}</span>
}

export const AccountViewClient: FC<{ account: Account; requiredPasswordScore: number }> = ({
  account: { user, isLinkedGoogle, isLinkedGitLab },
  requiredPasswordScore,
}) => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  const { confirmModal } = useSharedUIContext()

  const [targetChangePwd, setTargetChangePwd] = useState<string>()
  const changePwdModal = useDisclosure()
  const openChangePwdModal = changePwdModal.onOpen
  const [isLoadingUnlinkGoogle, setLoadingUnlinkGoogle] = useState(false)
  const [isLoadingUnlinkGitLab, setLoadingUnlinkGitLab] = useState(false)

  useEffect(() => {
    console.debug('targetChangePwd:', targetChangePwd)
    if (targetChangePwd) {
      openChangePwdModal()
    }
  }, [openChangePwdModal, targetChangePwd])

  return (
    <>
      <Card className='mt-2 w-full'>
        <CardBody className={gridStyles()}>
          <div className='col-span-3'>{t('item_username')}</div>
          <div className='col-span-9'>{user.name}</div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_password')}</div>
          <div className='col-span-9'>
            <ExButton
              isSmart
              onPress={() => setTargetChangePwd(user.id)}
              startContent={<KeyIcon size={iconSizes.sm} />}
            >
              {t('item_change_password')}
            </ExButton>
          </div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_isadmin')}</div>
          <div className='col-span-9'>
            <OnOffChip isEnable={user.isAdmin} messageOn={t('item_true')} messageOff={t('item_false')} />
          </div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_locale')}</div>
          <div className='col-span-9'>{user.locale || ''}</div>
          <Divider className='col-span-12' />

          <div className='col-span-3'>{t('item_email')}</div>
          <div className='col-span-9'>
            {user.email}
            <ExButton
              isSmart
              onPress={() => {
                // toast().info({ message: dayjs().format() })
              }}
              startContent={<PencilSquareIcon size={iconSizes.sm} />}
              variant='flat'
              className='ml-4'
            >
              {t('item_edit')}
            </ExButton>
          </div>
          <Divider className='col-span-12' />

          {isLinkedGoogle !== undefined && (
            <>
              <div className='col-span-3'>{t('item_link_oauth', { name: 'Google' })}</div>
              <div className='col-span-5'>
                <OnOffChip isEnable={isLinkedGoogle} messageOn={t('item_enabled')} messageOff={t('item_disabled')} />
              </div>
              <div className='col-span-4 flex items-center'>
                <Divider orientation='vertical' className='mr-2' />
                <ExButton
                  className='ml-2'
                  variant='solid'
                  color='danger'
                  isSmart
                  startContent={isLoadingUnlinkGoogle ? undefined : <BoltSlashIcon />}
                  isLoading={isLoadingUnlinkGoogle}
                  isDisabled={!isLinkedGoogle}
                  onPress={async () => {
                    console.debug('Unlink Google:')
                    const ok = await confirmModal().confirm({
                      title: t('item_confirme'),
                      text: t('msg_unlink_oauth_confirm', { name: 'Google' }),
                      requireCheck: true,
                      autoClose: true,
                    })
                    if (ok) {
                      setLoadingUnlinkGoogle(true)
                      await parseAction(unlinkOAuth({ type: 'google' }))
                      await intervalOperation()
                      setLoadingUnlinkGoogle(false)
                      refresh()
                    }
                  }}
                >
                  {t('item_unlink')}
                </ExButton>
              </div>
              <Divider className='col-span-12' />
            </>
          )}

          {isLinkedGitLab !== undefined && (
            <>
              <div className='col-span-3'>{t('item_link_oauth', { name: 'GitLab' })}</div>
              <div className='col-span-5'>
                <OnOffChip isEnable={isLinkedGitLab} messageOn={t('item_enabled')} messageOff={t('item_disabled')} />
              </div>
              <div className='col-span-4 flex items-center'>
                <Divider orientation='vertical' className='mr-2' />
                <ExButton
                  className='ml-2'
                  variant='solid'
                  color='danger'
                  isSmart
                  startContent={isLoadingUnlinkGitLab ? undefined : <BoltSlashIcon />}
                  isLoading={isLoadingUnlinkGitLab}
                  isDisabled={!isLinkedGitLab}
                  onPress={async () => {
                    console.debug('Unlink GitLab:')
                    const ok = await confirmModal().confirm({
                      title: t('item_confirme'),
                      text: t('msg_unlink_oauth_confirm', { name: 'GitLab' }),
                      requireCheck: true,
                      autoClose: true,
                    })
                    if (ok) {
                      setLoadingUnlinkGitLab(true)
                      await parseAction(unlinkOAuth({ type: 'gitlab' }))
                      await intervalOperation()
                      setLoadingUnlinkGitLab(false)
                      refresh()
                    }
                  }}
                >
                  {t('item_unlink')}
                </ExButton>
              </div>
              <Divider className='col-span-12' />
            </>
          )}

          <div className='col-span-3'>{t('item_updated_at')}</div>
          <div className='col-span-7'>{dayformat(user.updatedAt, 'jp-simple')}</div>
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
        requiredPasswordScore={requiredPasswordScore}
      />
    </>
  )
}
