import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

import {
  Flex,
  Icon,
  Text,
  Transition,
  WithDivide
} from '@/components/primitives'
import type { ColorValue, ThemeConditionProp } from '@/system'
import { colorWithOpacity } from '@/system/colors/color-with-opacity'

function getItemColor(
  disabled: boolean,
  active: boolean,
  dangerous: boolean
): ThemeConditionProp<ColorValue> {
  if (disabled) return { base: 'bg-400', dark: 'bg-600' }
  if (active && dangerous) return 'dangerous'
  if (active) return { base: 'bg-800', dark: 'bg-50' }
  if (dangerous) return 'dangerous'

  return 'bg-500'
}

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

export function ContextMenuItem({
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
    <WithDivide>
      <DropdownMenuPrimitive.Item
        asChild
        disabled={disabled || loading}
        onClick={e => {
          if (disabled || loading) {
            e.preventDefault()

            return
          }

          if (!shouldCloseMenuOnClick) {
            e.preventDefault()
          }
          e.stopPropagation()

          onClick()
        }}
      >
        <Transition duration={100}>
          <Text
            asChild
            color={getItemColor(disabled || loading, checked, dangerous)}
            weight={checked ? 'medium' : undefined}
          >
            <Flex
              align="center"
              bg={
                disabled || loading || checked
                  ? undefined
                  : {
                      hover: 'bg-200',
                      darkHover: colorWithOpacity('bg-700', '50%')
                    }
              }
              className={className}
              gap="md"
              p="md"
              style={{
                cursor: disabled || loading ? 'not-allowed' : 'pointer'
              }}
              width="100%"
            >
              {(() => {
                if (loading) {
                  return <Icon icon="svg-spinners:ring-resize" />
                }

                if (typeof icon === 'string') {
                  return <Icon icon={icon} />
                }

                return icon
              })()}
              <Text truncate style={{ width: '100%' }}>
                {namespace
                  ? t(
                      [
                        _.camelCase(label),
                        `buttons.${_.camelCase(label)}`,
                        label
                      ],
                      tProps
                    )
                  : label}
              </Text>
              {checked && (
                <Icon
                  color={
                    dangerous ? 'dangerous' : { base: 'bg-800', dark: 'bg-50' }
                  }
                  icon="tabler:check"
                  ml="md"
                />
              )}
            </Flex>
          </Text>
        </Transition>
      </DropdownMenuPrimitive.Item>
    </WithDivide>
  )
}
