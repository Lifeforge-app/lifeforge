import { Listbox } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import ListboxInputWrapper from '@components/Listbox/ListboxInputWrapper'
import ListboxTransition from '@components/Listbox/ListboxTransition'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'

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
    <ListboxInputWrapper
      value={category}
      onChange={color => {
        setCategory(color ?? '')
      }}
    >
      <Listbox.Button className="flex w-full items-center">
        <Icon
          icon="tabler:list"
          className={`ml-6 size-6 shrink-0 ${
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
          <span className="-mt-px block truncate">
            {categories.find(l => l.id === category)?.name ?? 'None'}
          </span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 right-0 mt-1 flex items-center pr-4">
          <Icon icon="tabler:chevron-down" className="size-5 text-bg-500" />
        </span>
      </Listbox.Button>
      <ListboxTransition>
        <Listbox.Options className="absolute bottom-[120%] z-50 mt-1 max-h-56 w-full divide-y divide-bg-200 overflow-auto rounded-md bg-bg-100 py-1 text-base shadow-lg focus:outline-none dark:divide-bg-700 dark:bg-bg-800 sm:text-sm">
          <Listbox.Option
            key={'none'}
            className={({ active }) =>
              `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
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
                `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
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
                        <Icon icon={icon} className="size-4" />
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
      </ListboxTransition>
    </ListboxInputWrapper>
  )
}

export default CategorySelector
