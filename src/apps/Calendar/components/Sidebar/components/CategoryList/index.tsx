import { Icon } from '@iconify/react'
import { useCallback } from 'react'

import { SidebarTitle } from '@lifeforge/ui'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import { useModalStore } from '../../../../../../core/modals/useModalStore'
import { type ICalendarCategory } from '../../../../interfaces/calendar_interfaces'
import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  selectedCategory,
  setSelectedCategory,
  categories
}: {
  selectedCategory: string | undefined
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>
  categories: ICalendarCategory[]
}) {
  const open = useModalStore(state => state.open)

  const handleSelect = useCallback(
    (item: ICalendarCategory) => {
      setSelectedCategory(item.id)
    },
    [setSelectedCategory]
  )

  const handleCancelSelect = useCallback(() => {
    setSelectedCategory(undefined)
  }, [setSelectedCategory])

  const handleCreate = useCallback(() => {
    open('calendar.modifyCategory', {
      existedData: null,
      type: 'create'
    })
  }, [])

  return (
    <>
      <section className="flex w-full min-w-0 flex-1 flex-col">
        <div className="mt-4">
          <SidebarTitle
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={handleCreate}
            name="Categories"
            namespace="apps.calendar"
          />
        </div>
        {[...categories, ...Object.keys(INTERNAL_CATEGORIES)].length > 0 ? (
          <ul className="-mt-2 flex h-full min-w-0 flex-col pb-4">
            {Object.entries(INTERNAL_CATEGORIES).map(([key, value]) => (
              <CategoryListItem
                key={key}
                isSelected={selectedCategory === key}
                item={value as ICalendarCategory}
                modifiable={false}
                onCancelSelect={handleCancelSelect}
                onSelect={handleSelect}
              />
            ))}
            {categories.map(item => (
              <CategoryListItem
                key={item.id}
                isSelected={selectedCategory === item.id}
                item={item}
                onCancelSelect={handleCancelSelect}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
            <Icon className="size-12" icon="tabler:article-off" />
            <p className="text-lg font-medium">Oops, no categories found.</p>
            <p className="text-bg-500 text-center text-sm">
              You can create categories by clicking the plus button above.
            </p>
          </div>
        )}
      </section>
    </>
  )
}

export default CategoryList
