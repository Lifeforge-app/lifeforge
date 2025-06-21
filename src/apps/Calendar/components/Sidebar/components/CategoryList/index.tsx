import { Icon } from '@iconify/react'
import { useCallback } from 'react'

import { QueryWrapper, SidebarTitle } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

import useAPIQuery from '@hooks/useAPIQuery'

import { type ICalendarCategory } from '../../../../interfaces/calendar_interfaces'
import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  selectedCategory,
  setSidebarOpen,
  setSelectedCategory
}: {
  selectedCategory: string | undefined
  setSidebarOpen: (value: boolean) => void
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | undefined>>
}) {
  const categoriesQuery = useAPIQuery<ICalendarCategory[]>(
    'calendar/categories',
    ['calendar', 'categories']
  )
  const open = useModalStore(state => state.open)

  const handleSelect = useCallback((item: ICalendarCategory) => {
    setSelectedCategory(item.id)
    setSidebarOpen(false)
  }, [])

  const handleCancelSelect = useCallback(() => {
    setSelectedCategory(undefined)
    setSidebarOpen(false)
  }, [])

  const handleCreate = useCallback(() => {
    open('calendar.modifyCategory', {
      existedData: null,
      type: 'create'
    })
  }, [])

  return (
    <QueryWrapper query={categoriesQuery}>
      {categories => (
        <section className="flex w-full min-w-0 flex-1 flex-col">
          <SidebarTitle
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={handleCreate}
            name="Categories"
            namespace="apps.calendar"
          />
          {[...categories, ...Object.keys(INTERNAL_CATEGORIES)].length > 0 ? (
            <ul className="-mt-2 flex h-full min-w-0 flex-col">
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
            <div className="flex h-full flex-col items-center justify-center gap-3 px-2">
              <Icon className="size-12" icon="tabler:article-off" />
              <p className="text-lg font-medium">Oops, no categories found.</p>
              <p className="text-bg-500 text-center text-sm">
                You can create categories by clicking the plus button above.
              </p>
            </div>
          )}
        </section>
      )}
    </QueryWrapper>
  )
}

export default CategoryList
