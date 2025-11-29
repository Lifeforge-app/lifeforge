import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import Button from '../controls/Button'

export interface EmptyStateScreenProps {
  /** Props for the call-to-action button. Refer to the Button component for available props. */
  CTAButtonProps?: React.ComponentProps<typeof Button>
  /** The message to display in the empty state.
   * If an object with `id` and optional `namespace` is provided, it will use translations.
   * The translation shall be looked up using the keys:
   * - Title: `[{tKey}.]empty.{id}.title`
   * - Description: `[{tKey}.]empty.{id}.description`
   *
   * Otherwise, a custom title and description can be provided.
   */
  message:
    | {
        id: string
        namespace?: string
        tKey?: string
      }
    | {
        title: string
        description?: string | React.ReactNode
      }
  /** The icon to display in the empty state. Can be a valid icon identifier from Iconify or a React element */
  icon?: string | React.ReactElement
  /** Whether to render a smaller version of the empty state screen.
   * Typically used for displaying empty states in compact areas like sidebars or widgets. */
  smaller?: boolean
  /** Additional CSS class names to apply to the outer wrapper of the component.
   * Use `!` suffix for Tailwind CSS class overrides. */
  className?: string
}

/**
 * A reusable empty state screen component for displaying when there is no data or content.
 */
function EmptyStateScreen({
  CTAButtonProps,
  message,
  icon,
  smaller = false,
  className
}: EmptyStateScreenProps) {
  const { t } = useTranslation(
    'namespace' in message ? message.namespace : undefined
  )

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
          smaller ? 'text-2xl' : 'text-3xl'
        )}
      >
        {'id' in message
          ? t(
              [message.tKey, 'empty', message.id, 'title']
                .filter(e => e)
                .join('.')
            )
          : message.title}
      </h2>
      {(() => {
        if ('title' in message) {
          return typeof message.description === 'string' ? (
            <p
              className={clsx(
                'text-bg-400 dark:text-bg-600 -mt-2 px-6 text-center whitespace-pre-wrap',
                smaller ? 'text-base' : 'text-lg'
              )}
            >
              {message.description}
            </p>
          ) : (
            message.description
          )
        }

        return (
          <p
            className={clsx(
              'text-bg-400 dark:text-bg-600 -mt-2 px-6 text-center whitespace-pre-wrap',
              smaller ? 'text-base' : 'text-lg'
            )}
          >
            {t(
              [message.tKey, 'empty', message.id, 'description']
                .filter(e => e)
                .join('.')
            )}
          </p>
        )
      })()}
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
