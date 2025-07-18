import { Icon } from '@iconify/react'
import clsx from 'clsx'
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
  icon?: string | React.ReactElement
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
      className={clsx(
        'flex-center size-full flex-col',
        smaller ? 'gap-3' : 'gap-6'
      )}
    >
      {icon !== undefined &&
        (typeof icon === 'string' ? (
          <Icon
            className={clsx(
              'text-bg-300 dark:text-bg-500 shrink-0',
              smaller ? 'size-24' : 'size-32'
            )}
            icon={icon}
          />
        ) : (
          icon
        ))}
      <h2
        className={clsx(
          'text-bg-500 px-6 text-center font-semibold',
          smaller ? 'text-3xl' : 'text-4xl'
        )}
      >
        {name
          ? t([tKey, 'empty', name, 'title'].filter(e => e).join('.'))
          : title}
      </h2>
      <p
        className={clsx(
          'text-bg-500 -mt-2 px-6 text-center whitespace-pre-wrap',
          smaller ? 'text-base' : 'text-lg'
        )}
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
