import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../buttons/Button'

function EmptyStateScreen({
  onCTAClick,
  name,
  title,
  description,
  icon,
  ctaContent,
  ctaTProps,
  ctaIcon,
  customCTAButton,
  smaller = false,
  namespace
}: {
  onCTAClick?: React.Dispatch<React.SetStateAction<'create' | 'update' | null>>
  name: string | false
  title?: string
  description?: string
  icon?: string
  ctaContent?: string
  ctaTProps?: Record<string, unknown>
  ctaIcon?: string
  customCTAButton?: React.ReactElement
  smaller?: boolean
  namespace?: string
}): React.ReactElement {
  const { t } = useTranslation(namespace)

  return (
    <div
      className={`flex-center size-full flex-col ${
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
        {name ? t(`empty.${name}.title`) : title}
      </h2>
      <p
        className={`-mt-2 px-8 text-center text-bg-500  ${
          smaller ? 'text-base' : 'text-lg'
        }`}
      >
        {name ? t(`empty.${name}.description`) : description}
      </p>
      {customCTAButton ??
        (ctaContent && onCTAClick && (
          <Button
            onClick={() => {
              onCTAClick('create')
            }}
            icon={ctaIcon ?? 'tabler:plus'}
            className="mt-6"
            tProps={ctaTProps}
          >
            {ctaContent}
          </Button>
        ))}
    </div>
  )
}

export default EmptyStateScreen
