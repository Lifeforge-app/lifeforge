import { type IIconSet } from '@components/inputs/IconInput/IconPickerModal/typescript/icon_selector_interfaces'

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
    } | null>
  >
}) {
  return (
    <div className="mb-6 w-full overflow-hidden">
      <div className="after:border-b-bg-800 dark:after:border-b-bg-200 relative mb-8 rounded-lg text-center text-2xl font-medium after:absolute after:-bottom-2 after:left-1/2 after:w-8 after:-translate-x-1/2 after:border-b-2">
        {category}
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] flex-wrap gap-3">
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
