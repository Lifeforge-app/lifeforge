import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React from 'react'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
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
    <ListboxInput
      name={t('input.eventCategory')}
      icon="tabler:list"
      value={category}
      setValue={setCategory}
      buttonContent={
        <>
          <Icon
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:list'
            }
            style={{
              color: categories.find(l => l.id === category)?.color
            }}
            className="size-5"
          />
          <span className="-mt-px block truncate">
            {categories.find(l => l.id === category)?.name ?? 'None'}
          </span>
        </>
      }
    >
      <ListboxOption
        key={'none'}
        className="flex-between relative flex cursor-pointer select-none bg-bg-200/50 p-4 transition-all dark:bg-bg-700/50"
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
      </ListboxOption>
      {categories.map(({ name, color, icon, id }, i) => (
        <ListboxOption
          key={i}
          className="flex-between relative flex cursor-pointer select-none bg-bg-200/50 p-4 transition-all dark:bg-bg-700/50"
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
        </ListboxOption>
      ))}
    </ListboxInput>
  )
}

export default CategorySelector
