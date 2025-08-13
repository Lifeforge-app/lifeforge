import { Icon } from '@iconify/react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import clsx from 'clsx'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'

function getBaseClassNames(
  disabled: boolean,
  active: boolean,
  isRed: boolean
): string {
  if (disabled) {
    return 'text-bg-300 dark:text-bg-700'
  }

  if (active) {
    return `${isRed === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'} hover:text-bg-800 dark:hover:text-bg-50`
  } else {
    return isRed ? 'text-red-500' : 'text-bg-500 dark:hover:text-bg-600'
  }
}

function getToggleIconClass(isRed?: boolean): string {
  return isRed === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'
}

function ContextMenuItem({
  icon,
  text,
  isRed = false,
  onClick,
  isToggled = false,
  disabled,
  preventDefault = false,
  namespace = 'common.buttons',
  loading = false,
  className
}: {
  icon?: string | React.ReactElement
  text: string
  isRed?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isToggled?: boolean
  disabled?: boolean
  preventDefault?: boolean
  namespace?: string | false
  loading?: boolean
  className?: string
}) {
  const { t } = useTranslation(namespace ? namespace : 'common.buttons')

  return (
    <DropdownMenuPrimitive.Item
      className={clsx(
        getBaseClassNames(disabled || loading, isToggled, isRed),
        !disabled && !loading && 'hover:bg-bg-200 dark:hover:bg-bg-700/50',
        'flex w-full cursor-default items-center gap-3 p-4 text-left outline-hidden transition-all select-none',
        className
      )}
      disabled={disabled || loading}
      onSelect={(e: Event) => {
        if (preventDefault) {
          e.preventDefault()
        }

        // Create a mock mouse event for compatibility
        const mockEvent = {
          preventDefault: () => e.preventDefault(),
          stopPropagation: () => e.stopPropagation(),
          currentTarget: e.currentTarget,
          target: e.target
        } as unknown as React.MouseEvent<HTMLButtonElement>

        onClick(mockEvent)
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
        {namespace !== false
          ? t([_.camelCase(text), `buttons.${_.camelCase(text)}`, text])
          : text}
      </span>
      {isToggled && (
        <Icon
          className={clsx(getToggleIconClass(isRed), 'ml-4 size-5 shrink-0')}
          icon="tabler:check"
        />
      )}
    </DropdownMenuPrimitive.Item>
  )
}

export default ContextMenuItem
