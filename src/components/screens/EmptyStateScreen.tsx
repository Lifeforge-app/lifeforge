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
  namespace,
  tKey = ''
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
  namespace: string | false
  tKey?: string
}): React.ReactElement {
  const { t } = useTranslation(namespace ? namespace : undefined)

  return (
    <div
      className={`flex-center size-full flex-col ${
        smaller ? 'gap-4' : 'gap-6'
      }`}
    >
      {icon !== undefined && (
        <Icon
          className={`${
            smaller ? 'size-24' : 'size-32'
          } shrink-0 text-bg-300 dark:text-bg-500`}
          icon={icon}
        />
      )}
      <h2
        className={`text-center px-6 ${
          smaller ? 'text-3xl' : 'text-4xl'
        } font-semibold text-bg-500`}
      >
        {name
          ? t([tKey, 'empty', name, 'title'].filter(e => e).join('.'))
          : title}
      </h2>
      <p
        className={`-mt-2 px-6 text-center text-bg-500  ${
          smaller ? 'text-base' : 'text-lg'
        }`}
      >
        {name
          ? t([tKey, 'empty', name, 'description'].filter(e => e).join('.'))
          : description}
      </p>
      {customCTAButton ??
        (ctaContent && onCTAClick && (
          <Button
            className="mt-6"
            icon={ctaIcon ?? 'tabler:plus'}
            tProps={ctaTProps}
            onClick={() => {
              onCTAClick('create')
            }}
          >
            {ctaContent}
          </Button>
        ))}
    </div>
  )
}

export default EmptyStateScreen
