import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React, { Fragment } from 'react'
import { type ICalendarCategory } from '@typedec/Calendar'

function CategorySelector({
  categories,
  category,
  setCategory
}: {
  categories: ICalendarCategory[] | 'loading' | 'error'
  category: string
  setCategory: React.Dispatch<React.SetStateAction<string>>
}): React.ReactElement {
  if (typeof categories === 'string') return <></>

  return (
    <Listbox
      value={category}
      onChange={color => {
        setCategory(color ?? '')
      }}
      as="div"
      className="group relative mt-4 flex items-center gap-1 rounded-t-lg border-b-2 border-bg-500 bg-bg-200/50 shadow-custom focus-within:!border-custom-500 dark:bg-bg-800/50"
    >
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon="tabler:list"
          className={`ml-6 h-6 w-6 shrink-0 ${
            category !== '' ? '' : 'text-bg-500'
          } group-focus-within:!text-custom-500`}
        />
        <span
          className={`pointer-events-none absolute left-[4.2rem] font-medium tracking-wide text-bg-500 group-focus-within:!text-custom-500 ${'top-5 -translate-y-1/2 text-[14px]'}`}
        >
          Category
        </span>
        <div className="relative mb-3 mt-10 flex w-full items-center gap-2 rounded-lg pl-5 pr-10 text-left focus:outline-none sm:text-sm">
          {category !== '' && (
            <span
              className="h-4 w-1 rounded-full"
              style={{
                backgroundColor: categories.find(l => l.id === category)?.color
              }}
            />
          )}
          <span className="mt-[-1px] block truncate">
            {categories.find(l => l.id === category)?.name ?? 'None'}
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
        <Listbox.Options className="absolute bottom-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
          <Listbox.Option
            key={'none'}
            className={({ active }) =>
              `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
              }`
            }
            value={''}
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-2">None</span>
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
          {categories.map(({ name, color, icon, id }, i) => (
            <Listbox.Option
              key={i}
              className={({ active }) =>
                `relative cursor-pointer select-none transition-all p-4 flex items-center justify-between ${
                  active ? 'bg-bg-200/50 dark:bg-bg-700/50' : '!bg-transparent'
                }`
              }
              value={id}
            >
              {({ selected }) => (
                <>
                  <div>
                    <span className="flex items-center gap-4">
                      <span
                        className="h-4 w-1 rounded-full"
                        style={{
                          backgroundColor: color
                        }}
                      />
                      <div className="flex items-center gap-2">
                        <Icon icon={icon} className="h-4 w-4" />
                        {name}
                      </div>
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

export default CategorySelector
