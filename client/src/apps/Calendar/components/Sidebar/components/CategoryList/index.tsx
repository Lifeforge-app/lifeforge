import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import type {
  CalendarCalendar,
  CalendarCategory
} from '@apps/Calendar/components/Calendar'
import ModifyCategoryModal from '@apps/Calendar/components/modals/ModifyCategoryModal'
import { INTERNAL_CATEGORIES } from '@apps/Calendar/constants/internalCategories'

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
  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
  )

  const open = useModalStore(state => state.open)

  const handleSelect = useCallback((item: CalendarCalendar) => {
    setSelectedCategory(item.id)
    setSidebarOpen(false)
  }, [])

  const handleCancelSelect = useCallback(() => {
    setSelectedCategory(undefined)
    setSidebarOpen(false)
  }, [])

  const handleCreate = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'create'
    })
  }, [])

  return (
    <WithQuery query={categoriesQuery}>
      {categories => (
        <section className="flex w-full min-w-0 flex-1 flex-col">
          <SidebarTitle
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={handleCreate}
            label="Categories"
            namespace="apps.calendar"
          />
          {[...categories, ...Object.keys(INTERNAL_CATEGORIES)].length > 0 ? (
            <ul className="-mt-2 flex h-full min-w-0 flex-col">
              {Object.entries(
                INTERNAL_CATEGORIES as unknown as CalendarCategory[]
              ).map(([key, value]) => (
                <CategoryListItem
                  key={key}
                  isSelected={selectedCategory === key}
                  item={value}
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
    </WithQuery>
  )
}

export default CategoryList
