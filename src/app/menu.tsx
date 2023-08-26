'use client'

import { UserCircleIcon } from '@/components/icons'
import { useLocaleW } from '@/locale'
import { Accordion, AccordionItem, AccordionItemProps } from '@nextui-org/react'
import { FC } from 'react'

const accordionStyles: AccordionItemProps['classNames'] = {
  title: 'text-small',
  titleWrapper: 'flex-none',
}

export const Menu: FC = () => {
  const { t } = useLocaleW()
  return (
    <div>
      <Accordion selectionMode='multiple' itemClasses={accordionStyles}>
        <AccordionItem isCompact={true} startContent={<UserCircleIcon size={20} />} title={t('group_user')}>
          aaa
        </AccordionItem>
      </Accordion>
    </div>
  )
}
