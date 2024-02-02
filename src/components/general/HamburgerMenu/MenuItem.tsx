import { Menu } from '@headlessui/react'
import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'

function MenuItem({
  icon,
  text,
  isRed = false,
  onClick
}: {
  icon: string
  text: string
  isRed?: boolean
  onClick: () => void
}): React.ReactElement {
  return (
    <Menu.Item>
      {({ active }) => (
        <button
          onClick={onClick}
          className={`${
            active
              ? `bg-bg-200/50 ${
                  isRed ? 'text-red-600' : 'text-bg-800'
                } dark:bg-bg-700 dark:text-bg-100`
              : isRed
              ? 'text-red-500'
              : 'text-bg-500'
          } flex w-full items-center p-4`}
        >
          <Icon icon={icon} className="h-5 w-5" />
          <span className="ml-2">{text}</span>
        </button>
      )}
    </Menu.Item>
  )
}

export default MenuItem
