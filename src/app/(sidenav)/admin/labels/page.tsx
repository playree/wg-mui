import { TagIcon } from '@/components/icons'
import { Loading } from '@/components/nextekit/ui/loading'
import { Metadata } from 'next'
import { FC, Suspense } from 'react'

import { LabelListClient, LabelsTitle } from './client'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Labels',
}

const LabelsPage: FC = () => {
  return (
    <div>
      <div className='mb-2 flex items-center pl-8 lg:pl-0'>
        <TagIcon className='mr-2' />
        <LabelsTitle />
      </div>

      <div className='flex min-h-[200px] w-full'>
        <Suspense fallback={<Loading />}>
          <LabelListClient />
        </Suspense>
      </div>
    </div>
  )
}
export default LabelsPage
