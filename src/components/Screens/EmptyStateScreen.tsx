/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../ButtonsAndInputs/Button'

function EmptyStateScreen({
  onCTAClick,
  title,
  description,
  icon,
  ctaContent,
  customCTAButton
}: {
  onCTAClick?: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  title: string
  description: string
  icon: string
  ctaContent?: string
  customCTAButton?: React.ReactElement
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="flex-center flex size-full flex-col gap-6 ">
      <Icon icon={icon} className="size-32 text-bg-500" />
      <h2 className="text-center text-3xl font-semibold">{t(title)}</h2>
      <p className="-mt-2 text-center text-lg text-bg-500">{t(description)}</p>
      {customCTAButton ??
        (ctaContent && onCTAClick && (
          <Button
            onClick={() => {
              onCTAClick('create')
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
