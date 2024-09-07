// PriorityListbox.tsx
import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'

const PRIORITIES = [
  {
    name: 'Low',
    color: 'text-green-500'
  },
  {
    name: 'Medium',
    color: 'text-yellow-500'
  },
  {
    name: 'High',
    color: 'text-red-500'
  }
]

function PrioritySelector({
  priority,
  setPriority
}: {
  priority: string | null
  setPriority: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  const { t } = useTranslation()

  return (
    <ListboxInput
      name={t('input.priority')}
      icon="tabler:alert-triangle"
      value={priority}
      setValue={setPriority}
      buttonContent={
        <>
          <span
            className={`text-center font-semibold ${
              PRIORITIES.find(e => e.name.toLowerCase() === priority)?.color
            }`}
          >
            {'!'.repeat(
              PRIORITIES.findIndex(e => e.name.toLowerCase() === priority) + 1
            )}
          </span>
          <span className="-mt-px block truncate">
            {(priority?.[0].toUpperCase() ?? '') + (priority?.slice(1) ?? '')}
          </span>
        </>
      }
    >
      {PRIORITIES.map(({ name, color }, i) => (
        <Listbox.Option
          key={i}
          className={({ active }) =>
            `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
              active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
            }`
          }
          value={name.toLowerCase()}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2">
                  <span className={`mr-2 text-center font-semibold ${color}`}>
                    {'!'.repeat(i + 1)}
                  </span>
                  {name}
                </span>
              </div>
              {selected && (
                <Icon
                  icon="tabler:check"
                  className="block text-lg text-custom-500"
                />
              )}
            </>
          )}
        </Listbox.Option>
      ))}
    </ListboxInput>
  )
}

export default PrioritySelector
