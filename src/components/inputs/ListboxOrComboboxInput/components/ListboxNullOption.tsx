import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function ListboxNullOption({
  icon,
  value = '',
  hasBgColor = false,
  text = 'None'
}: {
  icon: string
  value?: any
  hasBgColor?: boolean
  text?: string
}): React.ReactElement {
  return (
    <ListboxOption
      key="none"
      className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
      value={value}
    >
      {({ selected }) => (
        <>
          <div
            className={`flex items-center ${
              hasBgColor ? 'gap-4' : 'gap-2'
            } font-medium ${selected && 'text-bg-800 dark:text-bg-100'}`}
          >
            <span
              className={`rounded-md  ${
                hasBgColor
                  ? 'bg-bg-200 p-2 text-bg-500 dark:bg-bg-700/50'
                  : 'pr-2'
              }`}
            >
              <Icon className="size-5" icon={icon} />
            </span>
            <span>{text}</span>
          </div>
          {selected && (
            <Icon
              className="block text-lg text-custom-500"
              icon="tabler:check"
            />
          )}
        </>
      )}
    </ListboxOption>
  )
}

export default ListboxNullOption
