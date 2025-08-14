import { Icon } from '@iconify/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

interface ContextMenuItemProps {
  /** The text label for the menu item. */
  label: string
  /** The icon to display. Can be any valid icon identifier from Iconify or a React element. */
  icon?: string | React.ReactElement
  /** Whether the menu item should be styled as dangerous/destructive. */
  dangerous?: boolean
  /** Whether the menu item is in a checked state. Will display a check icon when true. */
  checked?: boolean
  /** Whether the menu item is disabled and non-interactive. */
  disabled?: boolean
  /** Whether the menu item is in a loading state. */
  loading?: boolean
  /** Whether the menu should close when this item is clicked. */
  shouldCloseMenuOnClick?: boolean
  /** Additional CSS class names to apply to the menu item. */
  className?: string
  /**
   * The translation namespace for internationalization.
   * Refer to the [main documentation](https://docs.lifeforge.melvinchia.dev) for more information on internationalization.
   */
  namespace?: string
  /**
   * Translation properties to pass to the translation function. Used for dynamic translations.
   * Refer to the [main documentation](https://docs.lifeforge.melvinchia.dev) for more information on internationalization.
   */
  tProps?: Record<string, unknown>
  /** Callback function executed when the menu item is clicked. */
  onClick: () => void
}

function getBaseClassNames(
  disabled: boolean,
  active: boolean,
  dangerous: boolean
): string {
  if (disabled) {
    return 'text-bg-400 dark:text-bg-600 cursor-not-allowed'
  }

  if (active) {
    return `${dangerous === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'} hover:text-bg-800 dark:hover:text-bg-50 font-medium`
  } else {
    return dangerous ? 'text-red-500' : 'text-bg-500 dark:hover:text-bg-600'
  }
}

function getToggleIconClass(dangerous?: boolean): string {
  return dangerous === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'
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
      className={clsx(
        getBaseClassNames(disabled || loading, checked, dangerous),
        !disabled && !loading && 'hover:bg-bg-200 dark:hover:bg-bg-700/50',
        'flex w-full cursor-default items-center gap-3 p-4 text-left outline-hidden transition-all select-none',
        className
      )}
      disabled={disabled || loading}
      onSelect={e => {
        if (!shouldCloseMenuOnClick) {
          e.preventDefault()
          e.stopPropagation()
        }

        onClick()
      }}
    >
      {(() => {
        if (loading) {
          return (
            <Icon className="size-5 shrink-0" icon="svg-spinners:180-ring" />
          )
        }

        if (typeof icon === 'string') {
          return <Icon className="size-5 shrink-0" icon={icon} />
        }

        return icon
      })()}
      <span className="w-full truncate whitespace-nowrap">
        {namespace
          ? t(
              [_.camelCase(label), `buttons.${_.camelCase(label)}`, label],
              tProps
            )
          : label}
      </span>
      {checked && (
        <Icon
          className={clsx(
            getToggleIconClass(dangerous),
            'ml-4 size-5 shrink-0'
          )}
          icon="tabler:check"
        />
      )}
    </DropdownMenuPrimitive.Item>
  )
}

export default ContextMenuItem
