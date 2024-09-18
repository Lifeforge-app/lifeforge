import { ListboxOption } from '@headlessui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import ListboxInput from '@components/ButtonsAndInputs/ListboxInput'
import { useWalletContext } from '@providers/WalletProvider'

function CategorySelector({
  category,
  setCategory,
  transactionType
}: {
  category: string | null
  setCategory: React.Dispatch<React.SetStateAction<string | null>>
  transactionType: string
}): React.ReactElement {
  const { t } = useTranslation()
  const { categories } = useWalletContext()

  if (categories === 'loading') {
    return <div>Loading...</div>
  }

  if (categories === 'error') {
    return <div>Error</div>
  }

  return (
    <ListboxInput
      name={t('input.category')}
      icon="tabler:apps"
      value={category}
      setValue={setCategory}
      buttonContent={
        <>
          <Icon
            icon={
              categories.find(l => l.id === category)?.icon ?? 'tabler:apps-off'
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
        className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-100 hover:dark:bg-bg-700/50"
        value={null}
      >
        {({ selected }) => (
          <>
            <div>
              <span className="flex items-center gap-2 font-medium">
                <span
                  className="rounded-md p-2"
                  style={{ backgroundColor: '#FFFFFF20' }}
                >
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
      {categories
        .filter(e => e.type === transactionType)
        .map(({ name, color, id, icon }, i) => (
          <ListboxOption
            key={i}
            className="flex-between relative flex cursor-pointer select-none p-4 transition-all hover:bg-bg-100 hover:dark:bg-bg-700/50"
            value={id}
          >
            {({ selected }) => (
              <>
                <div>
                  <span className="flex items-center gap-2 font-medium">
                    <span
                      className="rounded-md p-2"
                      style={{ backgroundColor: color + '20' }}
                    >
                      <Icon icon={icon} className="size-5" style={{ color }} />
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
