import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import { type IProjectsMCategory } from '@interfaces/projects_m_interfaces'

function CategorySelector({
  category,
  setCategory,
  categories
}: {
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  categories: IProjectsMCategory[] | 'loading' | 'error'
}): React.ReactElement {
  const { t } = useTranslation()

  if (categories === 'loading') {
    return <div>Loading...</div>
  }

  if (categories === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxInput
      name={t('input.projectCategory')}
      icon="tabler:apps"
      value={category}
      setValue={setCategory}
      buttonContent={
        <>
          <Icon
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:apps-off'
            }
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
        className={({ active }) =>
          `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
            active
              ? 'hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
              : '!bg-transparent'
          }`
        }
        value={null}
      >
        {({ selected }) => (
          <>
            <div>
              <span className="flex items-center gap-2 font-medium">
                <span className="rounded-md p-2">
                  <Icon
                    icon="tabler:apps-off"
                    className="size-5"
                    style={{ color: 'white' }}
                  />
                </span>
                <span>None</span>
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
      {categories.map(({ name, id, icon }, i) => (
        <ListboxOption
          key={i}
          className={({ active }) =>
            `relative cursor-pointer select-none transition-all p-4 flex flex-between ${
              active
                ? 'hover:bg-bg-200/50 dark:hover:bg-bg-700/50'
                : '!bg-transparent'
            }`
          }
          value={id}
        >
          {({ selected }) => (
            <>
              <div>
                <span className="flex items-center gap-2 font-medium">
                  <span className="rounded-md p-2">
                    <Icon icon={icon} className="size-5" />
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
        </ListboxOption>
      ))}
    </ListboxInput>
  )
}

export default CategorySelector
