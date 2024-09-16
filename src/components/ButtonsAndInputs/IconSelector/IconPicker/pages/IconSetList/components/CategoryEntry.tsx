import React from 'react'
import { type IIconSet } from '@interfaces/icon_selector_interfaces'
import IconSetEntry from './IconSetEntry'

function CategoryEntry({
  category,
  iconSets,
  iconFilterTerm,
  setCurrentIconSet
}: {
  category: string
  iconSets: IIconSet[]
  iconFilterTerm: string
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    }>
  >
}): React.ReactElement {
  return (
    <div className="mb-6 w-full overflow-hidden">
      <div className="relative mb-8 rounded-lg text-center text-2xl font-medium after:absolute after:-bottom-2 after:left-1/2 after:w-8 after:-translate-x-1/2 after:border-b-2 after:border-b-bg-800 after:dark:border-b-bg-200">
        {category}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] flex-wrap gap-4">
        {iconSets.map(
          iconSet =>
            (iconFilterTerm.trim() === '' ||
              iconSet.name
                .toLowerCase()
                .includes(iconFilterTerm.trim().toLowerCase())) && (
              <IconSetEntry
                key={iconSet.prefix}
                iconSet={iconSet}
                setCurrentIconSet={setCurrentIconSet}
              />
            )
        )}
      </div>
    </div>
  )
}

export default CategoryEntry
