/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../ButtonsAndInputs/Button'

function EmptyStateScreen({
  onCTAClick,
  name,
  title,
  description,
  icon,
  ctaContent,
  customCTAButton,
  smaller = false
}: {
  onCTAClick?: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  name?: string
  title?: string
  description?: string
  icon?: string
  ctaContent?: string
  customCTAButton?: React.ReactElement
  smaller?: boolean
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div
      className={`flex-center flex size-full flex-col ${
        smaller ? 'gap-4' : 'gap-6'
      }`}
    >
      {icon !== undefined && (
        <Icon
          icon={icon}
          className={`${
            smaller ? 'size-24' : 'size-32'
          } shrink-0 text-bg-300 dark:text-bg-500`}
        />
      )}
      <h2
        className={`text-center ${
          smaller ? 'text-3xl' : 'text-4xl'
        } font-semibold text-bg-500`}
      >
        {name ? t(`emptyState.${name}.title`) : title}
      </h2>
      <p
        className={`-mt-2 text-center text-bg-500  ${
          smaller ? 'text-base' : 'text-lg'
        }`}
      >
        {name ? t(`emptyState.${name}.description`) : description}
      </p>
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
