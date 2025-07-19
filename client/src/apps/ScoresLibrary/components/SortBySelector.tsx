import { Listbox, ListboxButton } from '@headlessui/react'
import { Icon } from '@iconify/react'
import { ListboxOrComboboxOption, ListboxOrComboboxOptions } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function SortBySelector({
  sortType,
  setSortType
}: {
  sortType: string
  setSortType: (sortType: string) => void
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const handleChange = useCallback((value: string) => {
    setSortType(value)
  }, [])

  return (
    <Listbox
      as="div"
      className="relative hidden md:block"
      value={sortType}
      onChange={handleChange}
    >
      <ListboxButton className="flex-between shadow-custom component-bg-with-hover mt-4 flex w-48 gap-2 rounded-md p-4">
        <div className="flex items-center gap-2">
          <Icon
            className="size-6"
            icon={
              SORT_TYPE.find(([, value]) => value === sortType)?.[0] ??
              'tabler:clock'
            }
          />
          <span className="font-medium whitespace-nowrap">
            {t(
              `sortTypes.${
                SORT_TYPE.find(([, value]) => value === sortType)?.[1] ??
                'newest'
              }`
            )}
          </span>
        </div>
        <Icon className="text-bg-500 size-5" icon="tabler:chevron-down" />
      </ListboxButton>
      <ListboxOrComboboxOptions customWidth="min-w-48">
        {SORT_TYPE.map(([icon, value]) => (
          <ListboxOrComboboxOption
            key={value}
            icon={icon}
            text={t(`sortTypes.${value}`)}
            value={value}
          />
        ))}
      </ListboxOrComboboxOptions>
    </Listbox>
  )
}

export default SortBySelector
