import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

function NodeListboxOption<T>({
  isSelected,
  value,
  children
}: {
  isSelected?: boolean
  value: T
  children: React.ReactNode
}) {
  return (
    <ListboxOption
      className={clsx(
        'hover:bg-bg-100 focus:bg-bg-100 dark:hover:bg-bg-700/50 dark:focus:bg-bg-700/50 flex-between gap-3 rounded p-2 text-base transition-colors focus:outline-none',
        isSelected ? 'text-bg-800 dark:text-bg-100' : 'text-bg-500'
      )}
      value={value}
    >
      {children}
      {isSelected && (
        <Icon
          className="text-bg-800 dark:text-bg-100 size-5"
          icon="tabler:check"
        />
      )}
    </ListboxOption>
  )
}

export default NodeListboxOption
