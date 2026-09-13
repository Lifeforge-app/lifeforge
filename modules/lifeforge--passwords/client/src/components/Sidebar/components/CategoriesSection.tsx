import {
  EmptyStateScreen,
  SidebarItem,
  SidebarTitle,
  WithQueryData,
  useModalStore,
  usePersonalization
} from '@lifeforge/ui'

import ModifyCategoriesModal from '@/components/modals/ModifyCategoriesModal'
import { forgeAPI } from '@/manifest'

import useFilter from '../../../hooks/useFilter'
import CategoryItem from './CategoryItem'

function CategoriesSection() {
  const { bgTempPalette } = usePersonalization()
  const { updateFilter, filter } = useFilter()
  const { open } = useModalStore()

  return (
    <>
      <SidebarTitle
        actionButton={{
          icon: 'tabler:plus',
          onClick: () => {
            open(ModifyCategoriesModal, { modifyType: 'create' })
          }
        }}
        label="sidebar.categories"
      />
      <WithQueryData contract={forgeAPI.categories.list}>
        {data =>
          data.length === 0 ? (
            <EmptyStateScreen
              smaller
              icon="tabler:apps-off"
              message={{ id: 'categories' }}
            />
          ) : (
            <>
              <SidebarItem
                active={!filter.category}
                icon="tabler:category"
                label="sidebar.allCategories"
                sideStripColor={bgTempPalette[500]}
                onClick={() => {
                  updateFilter('category', null)
                }}
              />
              {data.map(category => (
                <CategoryItem key={category.id} category={category} />
              ))}
            </>
          )
        }
      </WithQueryData>
    </>
  )
}

export default CategoriesSection
