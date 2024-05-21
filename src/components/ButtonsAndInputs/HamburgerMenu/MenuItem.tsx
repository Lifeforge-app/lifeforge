import { Menu } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function getActiveClass(active?: boolean, isRed?: boolean): string {
  if (active === true) {
    return `bg-bg-200/50 ${
      isRed === true ? 'text-red-600' : 'text-bg-800'
    } dark:bg-bg-700 dark:text-bg-100`
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
  isToggled
}: {
  icon: string
  text: string
  isRed?: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  isToggled?: boolean
}): React.ReactElement {
  return (
    <Menu.Item>
      {function ({ active }) {
        return (
          <button
            onClick={onClick}
            className={`${getActiveClass(
              active,
              isRed
            )} flex w-full items-center p-4 text-left`}
          >
            <Icon icon={icon} className="h-5 w-5 shrink-0" />
            <span className="ml-4 w-full">{text}</span>
            {isToggled === true && (
              <Icon
                icon="tabler:check"
                className={`${getToggleIconClass(isRed)} ml-4 h-5 w-5 shrink-0`}
              />
            )}
          </button>
        )
      }}
    </Menu.Item>
  )
}

export default MenuItem
