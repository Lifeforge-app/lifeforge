// PriorityListbox.tsx
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment } from 'react'

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
  priority: string
  setPriority: (priority: string) => void
}): React.ReactElement {
  return (
    <Listbox
      value={priority}
      onChange={setPriority}
      as="div"
      className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
    >
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon="tabler:alert-triangle"
          className={`ml-6 h-6 w-6 shrink-0 ${''} group-focus-within:!text-custom-500`}
        />
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-6 -translate-y-1/2 text-[14px]'}`}
        >
          Priority
        </span>
        <div className="relative mb-2 mt-9 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none sm:text-sm">
          <span
            className={`text-center font-semibold ${
              PRIORITIES.find(e => e.name.toLowerCase() === priority)?.color
            }`}
          >
            {'!'.repeat(
              PRIORITIES.findIndex(e => e.name.toLowerCase() === priority) + 1
            )}
          </span>
          <span className="mt-[-1px] block truncate">
            {priority[0].toUpperCase() + priority.slice(1)}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
          <Icon icon="tabler:chevron-down" className="h-5 w-5 text-bg-500" />
        </span>
      </Listbox.Button>
      <Transition
        as={Fragment}
        enter="transition ease-in duration-100"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Listbox.Options className="absolute top-[4.5rem] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
          {PRIORITIES.map(({ name, color }, i) => (
            <Listbox.Option
              key={i}
              className={({ active }) =>
                `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                  active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
                }`
              }
              value={name.toLowerCase()}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-2">
                      <span
                        className={`mr-2 text-center font-semibold ${color}`}
                      >
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
        </Listbox.Options>
      </Transition>
    </Listbox>
  )
}

export default PrioritySelector
