import { memo } from 'react'

import type { IIconSet } from '../../../typescript/icon_selector_interfaces'
import IconSetEntry from './IconSetEntry'

function CategoryEntry({
  category,
  iconSets,
  setCurrentIconSet
}: {
  category: string
  iconSets: IIconSet[]
  setCurrentIconSet: React.Dispatch<
    React.SetStateAction<{
      iconSet?: string
      search?: string
    } | null>
  >
}) {
  return (
    <div className="mb-6 w-full overflow-hidden">
      <div className="after:border-b-custom-500 relative mb-8 rounded-lg text-center text-2xl font-semibold after:absolute after:-bottom-2 after:left-1/2 after:w-8 after:-translate-x-1/2 after:border-b-2">
        {category}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] flex-wrap gap-3">
        {iconSets.map(iconSet => (
          <IconSetEntry
            key={iconSet.prefix}
            iconSet={iconSet}
            setCurrentIconSet={setCurrentIconSet}
          />
        ))}
      </div>
    </div>
  )
}

export default memo(CategoryEntry)
