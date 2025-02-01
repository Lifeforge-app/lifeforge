import { Icon } from '@iconify/react'
import React from 'react'
import { SidebarTitle } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'
import { type Loadable } from '@interfaces/common'
import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  categories,
  setModifyCategoryModalOpenType,
  setExistedData,
  setDeleteCategoryConfirmationModalOpen
}: {
  categories: Loadable<ICalendarCategory[]>
  setModifyCategoryModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarCategory | null>>
  setDeleteCategoryConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <>
      <section className="flex w-full min-w-0 flex-1 flex-col">
        <div className="mt-4">
          <SidebarTitle
            name="Categories"
            namespace="modules.calendar"
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() => {
              setModifyCategoryModalOpenType('create')
              setExistedData(null)
            }}
          />
        </div>
        <APIFallbackComponent data={categories}>
          {categories =>
            categories.length > 0 ? (
              <ul className="-mt-2 flex h-full min-w-0 flex-col pb-4">
                {categories.map(item => (
                  <CategoryListItem
                    key={item.id}
                    item={item}
                    setModifyModalOpenType={setModifyCategoryModalOpenType}
                    setSelectedData={setExistedData}
                    setDeleteConfirmationModalOpen={
                      setDeleteCategoryConfirmationModalOpen
                    }
                  />
                ))}
              </ul>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
                <Icon icon="tabler:article-off" className="size-12" />
                <p className="text-lg font-medium">
                  Oops, no categories found.
                </p>
                <p className="text-center text-sm text-bg-500">
                  You can create categories by clicking the plus button above.
                </p>
              </div>
            )
          }
        </APIFallbackComponent>
      </section>
    </>
  )
}

export default CategoryList
