'use client'

import { ArrowPathIcon } from '@/components/icons'
import { ExButton } from '@/components/nextekit/ui/button'
import { gridStyles } from '@/components/styles'
import { TypePeer } from '@/helpers/schema'
import { useLocale } from '@/locale'
import { Card, CardHeader } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import { FC } from 'react'
import { twMerge } from 'tailwind-merge'

export const PeerTitle: FC = () => {
  const { t } = useLocale()
  return <span className='mr-8 text-lg'>{t('menu_peer')}</span>
}

export const RefreshButton: FC = () => {
  const { t } = useLocale()
  const { refresh } = useRouter()
  return (
    <ExButton isIconOnly isSmart tooltip={t('item_refresh')} onPress={() => refresh()}>
      <ArrowPathIcon />
    </ExButton>
  )
}

export const PeerViewClient: FC<{ peerList: TypePeer[] }> = ({ peerList }) => {
  const { t } = useLocale()

  return (
    <>
      <div className={twMerge(gridStyles(), 'mt-4 w-full')}>
        {peerList.map((peer) => {
          return (
            <Card key={peer.ip} className='col-span-12'>
              <CardHeader className='justify-between py-2'>{peer.ip}</CardHeader>
            </Card>
          )
        })}
      </div>
    </>
  )
}
