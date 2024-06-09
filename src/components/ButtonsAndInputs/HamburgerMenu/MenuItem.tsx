import { Menu } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function getActiveClass(active?: boolean, isRed?: boolean): string {
  if (active === true) {
    return `bg-bg-200/50 ${
      isRed === true ? 'text-red-600' : 'text-bg-800 dark:text-bg-100'
    } dark:bg-bg-700`
  } else {
    return isRed === true ? 'text-red-500' : 'text-bg-500'
  }
}

function getToggleIconClass(isRed?: boolean): string {
  return isRed === true ? 'text-red-600' : 'text-custom-500'
}

function MenuItem({
  icon,
  text,
  isRed = false,
  onClick,
  isToggled,
  disabled,
  preventDefault = true
}: {
  icon: string
  text: string
  isRed?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isToggled?: boolean
  disabled?: boolean
  preventDefault?: boolean
}): React.ReactElement {
  return (
    <Menu.Item>
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
            )} flex w-full items-center p-4 text-left`}
          >
            <Icon icon={icon} className="size-5 shrink-0" />
            <span className="ml-4 w-full whitespace-nowrap">{text}</span>
            {isToggled === true && (
              <Icon
                icon="tabler:check"
                className={`${getToggleIconClass(isRed)} ml-4 size-5 shrink-0`}
              />
            )}
          </button>
        )
      }}
    </Menu.Item>
  )
}

export default MenuItem
