import { Icon } from '@iconify/react'
import { Listbox, ListboxOption } from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { ScoreLibrarySortType } from '..'

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
  sortType: ScoreLibrarySortType
  setSortType: (sortType: ScoreLibrarySortType) => void
}) {
  const { t } = useTranslation('apps.scoresLibrary')

  const handleChange = useCallback((value: ScoreLibrarySortType) => {
    setSortType(value)
  }, [])

  return (
    <Listbox
      buttonContent={
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
      }
      className="bg-bg-50 w-min"
      setValue={handleChange}
      value={sortType}
    >
      {SORT_TYPE.map(([icon, value]) => (
        <ListboxOption
          key={value}
          icon={icon}
          text={t(`sortTypes.${value}`)}
          value={value}
        />
      ))}
    </Listbox>
  )
}

export default SortBySelector
