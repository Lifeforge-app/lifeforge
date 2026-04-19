import { Icon } from '@iconify/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import { Flex, Text } from '@components/primitives'

import { vars } from '@/system'

import * as styles from './ContextMenuItem.css'

interface ContextMenuItemProps {
  /** The text label for the menu item. */
  label: string
  /** The icon to display. Can be any valid icon identifier from Iconify or a React element. */
  icon?: string | React.ReactElement
  /** Whether the menu item should be styled as dangerous/destructive. */
  dangerous?: boolean
  /** Whether the menu item is in a checked state. Displays a check icon when true. */
  checked?: boolean
  /** Whether the menu item is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the menu item is in a loading state. */
  loading?: boolean
  /** Whether the menu should close when this item is clicked. */
  shouldCloseMenuOnClick?: boolean
  /** Additional CSS class names to apply to the menu item. */
  className?: string
  /** The i18n namespace for internationalization. See the [main documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  namespace?: string
  /** Additional properties for the translation function. Used for dynamic translations. See the [i18n documentation](https://docs.lifeforge.melvinchia.dev) for more details. */
  tProps?: Record<string, unknown>
  /** Callback function called when the menu item is clicked. */
  onClick: () => void
}

function getStateClassName(
  disabled: boolean,
  active: boolean,
  dangerous: boolean
): string {
  if (disabled) return styles.itemDisabled
  if (active)
    return dangerous ? styles.itemActiveDangerous : styles.itemActiveSafe

  return dangerous ? styles.itemInactiveDangerous : styles.itemInactiveSafe
}

function ContextMenuItem({
  label,
  icon,
  dangerous = false,
  checked = false,
  loading = false,
  disabled = false,
  shouldCloseMenuOnClick = true,
  className,
  namespace = 'common.buttons',
  tProps,
  onClick
}: ContextMenuItemProps) {
  const { t } = useTranslation(namespace)

  return (
    <DropdownMenuPrimitive.Item
      asChild
      disabled={disabled || loading}
      onClick={e => {
        if (disabled || loading) {
          return
        }

        e.stopPropagation()

        if (!shouldCloseMenuOnClick) {
          e.preventDefault()
        }

        onClick()
      }}
    >
      <Flex
        align="center"
        className={clsx(
          styles.item,
          getStateClassName(disabled || loading, checked, dangerous),
          !disabled && !loading && styles.itemHoverable,
          className
        )}
        p="md"
        style={{ gap: '0.75rem' }}
        width="100%"
      >
        {(() => {
          if (loading) {
            return (
              <Icon
                icon="svg-spinners:ring-resize"
                style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}
              />
            )
          }

          if (typeof icon === 'string') {
            return (
              <Icon
                icon={icon}
                style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }}
              />
            )
          }

          return icon
        })()}
        <Text truncate style={{ width: '100%' }}>
          {namespace
            ? t(
                [_.camelCase(label), `buttons.${_.camelCase(label)}`, label],
                tProps
              )
            : label}
        </Text>
        {checked && (
          <Icon
            className={
              dangerous ? styles.checkIconDangerous : styles.checkIconSafe
            }
            icon="tabler:check"
            style={{
              marginLeft: vars.space.md,
              width: '1.25rem',
              height: '1.25rem',
              flexShrink: 0
            }}
          />
        )}
      </Flex>
    </DropdownMenuPrimitive.Item>
  )
}

export default ContextMenuItem
