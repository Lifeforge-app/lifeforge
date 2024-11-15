import { ListboxOption as HeadlessListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'

function ListboxOption({
  value,
  text,
  icon,
  color
}: {
  value: string
  text: string
  icon?: string
  color?: string
}): React.ReactElement {
  return (
    <HeadlessListboxOption
      className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-200 dark:hover:bg-bg-700/50"
      value={value}
    >
      {({ selected }) => (
        <>
          <div
            className={`flex items-center ${
              color !== undefined ? 'gap-4' : 'gap-2'
            } ${selected ? 'font-semibold text-bg-800 dark:text-bg-100' : ''}`}
          >
            {icon !== undefined ? (
              <span
                className={`rounded-md ${color !== undefined ? 'p-2' : 'pr-2'}`}
                style={
                  color !== undefined
                    ? {
                        backgroundColor: color + '20',
                        color
                      }
                    : {}
                }
              >
                <Icon icon={icon} className="size-5" />
              </span>
            ) : (
              color !== undefined && (
                <span
                  className="block h-6 w-1 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )
            )}
            {text}
          </div>
          {selected && (
            <Icon
              icon="tabler:check"
              className="block text-lg text-custom-500"
            />
          )}
        </>
      )}
    </HeadlessListboxOption>
  )
}

export default ListboxOption
