import { MenuItem as HeadlessMenuItem } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function getActiveClass(active?: boolean, isRed?: boolean): string {
  if (active === true) {
    return `bg-bg-200/50! ${
      isRed === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'
    } dark:bg-bg-700`
  } else {
    return isRed === true ? 'text-red-500' : 'text-bg-500'
  }
}

function getToggleIconClass(isRed?: boolean): string {
  return isRed === true ? 'text-red-600' : 'text-bg-500'
}

function MenuItem({
  icon,
  text,
  isRed = false,
  onClick,
  isToggled,
  disabled,
  preventDefault = false,
  namespace = 'common.buttons',
  loading = false
}: {
  icon?: string | React.ReactElement
  text: string
  isRed?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>, close: () => void) => void
  isToggled?: boolean
  disabled?: boolean
  preventDefault?: boolean
  namespace?: string | false
  loading?: boolean
}): React.ReactElement {
  const { t } = useTranslation(namespace ? namespace : 'common.buttons')

  return (
    <HeadlessMenuItem>
      {function ({ active, close }) {
        return (
          <button
            className={clsx(
              !disabled && !loading
                ? getActiveClass(active, isRed)
                : 'text-bg-500',
              'flex w-full items-center gap-4 p-4 text-left transition-all'
            )}
            disabled={disabled || loading}
            onClick={e => {
              if (preventDefault) {
                e.preventDefault()
              }
              e.stopPropagation()
              onClick(e, close)
            }}
          >
            {loading ? (
              <Icon className="size-5 shrink-0" icon="svg-spinners:180-ring" />
            ) : typeof icon === 'string' ? (
              <Icon className="size-5 shrink-0" icon={icon} />
            ) : (
              icon
            )}
            <span className="w-full truncate whitespace-nowrap">
              {namespace !== false
                ? t([toCamelCase(text), `buttons.${toCamelCase(text)}`])
                : text}
            </span>
            {isToggled && (
              <Icon
                className={clsx(
                  getToggleIconClass(isRed),
                  'ml-4 size-5 shrink-0'
                )}
                icon="tabler:check"
              />
            )}
          </button>
        )
      }}
    </HeadlessMenuItem>
  )
}

export default MenuItem
