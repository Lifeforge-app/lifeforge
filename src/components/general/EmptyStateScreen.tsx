/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react'
import React from 'react'
import Button from './Button'

function EmptyStateScreen({
  setModifyModalOpenType,
  title,
  description,
  icon,
  ctaContent,
  customCTAButton
}: {
  setModifyModalOpenType?: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  title: string
  description: string
  icon: string
  ctaContent?: string
  customCTAButton?: React.ReactElement
}): React.ReactElement {
  return (
    <div className="flex-center flex h-full w-full flex-col gap-6 ">
      <Icon icon={icon} className="h-32 w-32" />
      <h2 className="text-center text-3xl font-semibold">{title}</h2>
      <p className="-mt-2 text-center text-lg text-bg-500">{description}</p>
      {customCTAButton ??
        (ctaContent && setModifyModalOpenType && (
          <Button
            onClick={() => {
              setModifyModalOpenType('create')
            }}
            icon="tabler:plus"
            className="mt-6"
          >
            {ctaContent}
          </Button>
        ))}
    </div>
  )
}

export default EmptyStateScreen
