import { useQuery } from '@tanstack/react-query'

import {
  EmptyStateScreen,
  SidebarTitle,
  Stack,
  WithQuery,
  useModalStore
} from '@lifeforge/ui'

import ModifyCategoryModal from '@/components/modals/ModifyCategoryModal'
import { useInternalCategories } from '@/hooks/useInternalCategories'
import { forgeAPI } from '@/manifest'

import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  selectedCategory,
  setSelectedCategory
}: {
  selectedCategory: string | null
  setSelectedCategory: (value: string | null) => void
}) {
  const categoriesQuery = useQuery(forgeAPI.categories.list.queryOptions())
  const { values: internalCategories } = useInternalCategories()
  const { open } = useModalStore()

  return (
    <WithQuery query={categoriesQuery}>
      {categories => (
        <Stack as="section">
          <SidebarTitle
            actionButton={{
              icon: 'tabler:plus',
              onClick: () =>
                open(ModifyCategoryModal, {
                  type: 'create'
                })
            }}
            label="Categories"
          />
          {[...categories, ...internalCategories].length > 0 ? (
            <>
              {internalCategories.map(item => (
                <CategoryListItem
                  key={item.id}
                  isSelected={selectedCategory === item.id}
                  item={item}
                  modifiable={false}
                  onCancelSelect={() => setSelectedCategory(null)}
                  onSelect={() => setSelectedCategory(item.id)}
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
            </>
          ) : (
            <EmptyStateScreen
              smaller
              icon="tabler:article-off"
              message={{
                id: 'categories'
              }}
            />
          )}
        </Stack>
      )}
    </WithQuery>
  )
}

export default CategoryList
