import type { CalendarCategory } from '@/components/Calendar'
import ModifyCategoryModal from '@/components/modals/ModifyCategoryModal'
import { INTERNAL_CATEGORIES } from '@/constants/internalCategories'
import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useQuery } from '@tanstack/react-query'
import { SidebarTitle, WithQuery } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'

import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  selectedCategory,
  setSelectedCategory
}: {
  selectedCategory: string | null
  setSelectedCategory: React.Dispatch<React.SetStateAction<string | null>>
}) {
  const categoriesQuery = useQuery(
    forgeAPI.calendar.categories.list.queryOptions()
  )

  const open = useModalStore(state => state.open)

  return (
    <WithQuery query={categoriesQuery}>
      {categories => (
        <section className="flex w-full min-w-0 flex-1 flex-col">
          <SidebarTitle
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() =>
              open(ModifyCategoryModal, {
                type: 'create'
              })
            }
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
                  onCancelSelect={() => setSelectedCategory(null)}
                  onSelect={() => setSelectedCategory(value.id)}
                />
              ))}
              {categories.map(item => (
                <CategoryListItem
                  key={item.id}
                  isSelected={selectedCategory === item.id}
                  item={item}
                  onCancelSelect={() => setSelectedCategory(null)}
                  onSelect={() => setSelectedCategory(item.id)}
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
