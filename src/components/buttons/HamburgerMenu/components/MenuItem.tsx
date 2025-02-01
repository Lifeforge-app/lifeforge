import { MenuItem as HeadlessMenuItem } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toCamelCase } from '@utils/strings'

function getActiveClass(active?: boolean, isRed?: boolean): string {
  if (active === true) {
    return `bg-bg-200/50 ${
      isRed === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'
    } dark:bg-bg-700`
  } else {
    return isRed === true ? 'text-red-500' : 'text-bg-500'
  }
}

function getToggleIconClass(isRed?: boolean): string {
  return isRed === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-50'
}

function MenuItem({
  icon,
  text,
  isRed = false,
  onClick,
  isToggled,
  disabled,
  preventDefault = false,
  namespace = 'common.buttons'
}: {
  icon?: string
  text: string
  isRed?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isToggled?: boolean
  disabled?: boolean
  preventDefault?: boolean
  namespace?: string | false
}): React.ReactElement {
  const { t } = useTranslation(namespace ? namespace : 'common.buttons')

  return (
    <HeadlessMenuItem>
      {function ({ active }) {
        return (
          <button
            disabled={disabled}
            onClick={e => {
              if (preventDefault) {
                e.preventDefault()
              }
              e.stopPropagation()
              onClick(e)
            }}
            className={`${getActiveClass(
              active,
              isRed
            )} flex w-full items-center gap-4 p-4 text-left transition-all`}
          >
            {icon !== undefined && (
              <Icon icon={icon} className="size-5 shrink-0" />
            )}
            <span className="w-full truncate whitespace-nowrap">
              {namespace !== false
                ? t([toCamelCase(text), `buttons.${toCamelCase(text)}`])
                : text}
            </span>
            {isToggled === true && (
              <Icon
                icon="tabler:check"
                className={`${getToggleIconClass(isRed)} ml-4 size-5 shrink-0`}
              />
            )}
          </button>
        )
      }}
    </HeadlessMenuItem>
  )
}

export default MenuItem
