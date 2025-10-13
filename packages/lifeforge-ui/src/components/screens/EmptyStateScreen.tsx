import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Button from '../buttons/Button'

function EmptyStateScreen({
  CTAButtonProps,
  name,
  title,
  description,
  icon,
  smaller = false,
  namespace,
  tKey = '',
  className
}: {
  CTAButtonProps?: React.ComponentProps<typeof Button>
  name: string | false
  title?: string
  description?: string | React.ReactNode
  icon?: string | React.ReactElement
  smaller?: boolean
  namespace?: string
  tKey?: string
  className?: string
}) {
  const { t } = useTranslation(namespace)

  return (
    <div
      className={clsx(
        'flex-center size-full flex-col',
        smaller ? 'gap-3' : 'gap-6',
        className
      )}
    >
      {icon !== undefined &&
        (typeof icon === 'string' ? (
          <Icon
            className={clsx(
              'text-bg-400 dark:text-bg-600 shrink-0',
              smaller ? 'size-18' : 'size-32'
            )}
            icon={icon}
          />
        ) : (
          icon
        ))}
      <h2
        className={clsx(
          'text-bg-400 dark:text-bg-600 px-6 text-center font-semibold',
          smaller ? 'text-2xl' : 'text-4xl'
        )}
      >
        {name
          ? t([tKey, 'empty', name, 'title'].filter(e => e).join('.'))
          : title}
      </h2>
      {typeof description === 'string' || !description ? (
        <p
          className={clsx(
            'text-bg-400 dark:text-bg-600 -mt-2 whitespace-pre-wrap px-6 text-center',
            smaller ? 'text-base' : 'text-xl'
          )}
        >
          {name
            ? t([tKey, 'empty', name, 'description'].filter(e => e).join('.'))
            : description}
        </p>
      ) : (
        description
      )}
      {CTAButtonProps && (
        <Button
          {...CTAButtonProps}
          className={clsx('mt-4', CTAButtonProps.className)}
        />
      )}
    </div>
  )
}

export default EmptyStateScreen
