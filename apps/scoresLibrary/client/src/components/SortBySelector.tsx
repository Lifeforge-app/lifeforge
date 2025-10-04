import { Icon } from '@iconify/react'
import { Listbox, ListboxOption } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'

import useFilter from '../hooks/useFilter'

const SORT_TYPE = [
  ['tabler:clock', 'newest'],
  ['tabler:clock', 'oldest'],
  ['tabler:at', 'author'],
  ['tabler:abc', 'name']
]

function SortBySelector() {
  const { t } = useTranslation('apps.scoresLibrary')

  const { sort, updateFilter } = useFilter()

  return (
    <Listbox
      buttonContent={
        <div className="flex items-center gap-2">
          <Icon
            className="size-6 shrink-0"
            icon={
              SORT_TYPE.find(([, value]) => value === sort)?.[0] ??
              'tabler:clock'
            }
          />
          <span className="w-full truncate font-medium whitespace-nowrap">
            {t(
              `sortTypes.${
                SORT_TYPE.find(([, value]) => value === sort)?.[1] ?? 'newest'
              }`
            )}
          </span>
        </div>
      }
      className="component-bg-with-hover! w-full min-w-56 md:w-min"
      setValue={value => updateFilter('sort', value)}
      value={sort}
    >
      {SORT_TYPE.map(([icon, value]) => (
        <ListboxOption
          key={value}
          icon={icon}
          label={t(`sortTypes.${value}`)}
          value={value}
        />
      ))}
    </Listbox>
  )
}

export default SortBySelector
