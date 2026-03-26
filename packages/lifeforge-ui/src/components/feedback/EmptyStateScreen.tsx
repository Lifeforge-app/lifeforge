import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'

import { Box, Flex, Text } from '@components/primitives'

import Button from '../inputs/Button'
import * as styles from './EmptyStateScreen.css'

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
    <Flex
      align="center"
      className={className}
      direction="column"
      height="100%"
      justify="center"
      style={{ gap: smaller ? '0.75rem' : '1.5rem' }}
      width="100%"
    >
      {icon !== undefined &&
        (typeof icon === 'string' ? (
          <Icon
            className={styles.mutedColor}
            icon={icon}
            style={{
              width: smaller ? '4.5rem' : '8rem',
              height: smaller ? '4.5rem' : '8rem',
              flexShrink: 0
            }}
          />
        ) : (
          icon
        ))}
      <Text
        align="center"
        as="h2"
        className={styles.mutedColor}
        size={smaller ? '2xl' : '3xl'}
        style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}
        weight="semibold"
      >
        {'id' in message
          ? t(
              [message.tKey, 'empty', message.id, 'title']
                .filter(e => e)
                .join('.')
            )
          : message.title}
      </Text>
      {(() => {
        if ('title' in message) {
          return typeof message.description === 'string' ? (
            <Text
              align="center"
              as="p"
              className={clsx(styles.mutedColor, styles.preWrap)}
              size={smaller ? 'base' : 'lg'}
              style={{
                marginTop: '-0.5rem',
                paddingLeft: '1.5rem',
                paddingRight: '1.5rem'
              }}
            >
              {message.description}
            </Text>
          ) : (
            message.description
          )
        }

        return (
          <Text
            align="center"
            as="p"
            className={clsx(styles.mutedColor, styles.preWrap)}
            size={smaller ? 'base' : 'lg'}
            style={{
              marginTop: '-0.5rem',
              paddingLeft: '1.5rem',
              paddingRight: '1.5rem'
            }}
          >
            {t(
              [message.tKey, 'empty', message.id, 'description']
                .filter(e => e)
                .join('.')
            )}
          </Text>
        )
      })()}
      {CTAButtonProps && (
        <Box mt="md">
          <Button {...CTAButtonProps} />
        </Box>
      )}
    </Flex>
  )
}

export default EmptyStateScreen
