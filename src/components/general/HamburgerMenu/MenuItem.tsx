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
              ? `bg-neutral-200/50 ${
                  isRed ? 'text-red-600' : 'text-neutral-800'
                } dark:bg-neutral-700 dark:text-neutral-100`
              : isRed
              ? 'text-red-500'
              : 'text-neutral-500'
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
