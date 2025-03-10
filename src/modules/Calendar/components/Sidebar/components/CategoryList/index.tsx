import { Icon } from '@iconify/react'
import React from 'react'
import { SidebarTitle } from '@components/layouts/sidebar'
import { type ICalendarCategory } from '@interfaces/calendar_interfaces'
import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  categories,
  setModifyCategoryModalOpenType,
  setExistedData,
  setDeleteCategoryConfirmationModalOpen
}: {
  categories: ICalendarCategory[]
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
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() => {
              setModifyCategoryModalOpenType('create')
              setExistedData(null)
            }}
            name="Categories"
            namespace="modules.calendar"
          />
        </div>
        {categories.length > 0 ? (
          <ul className="-mt-2 flex h-full min-w-0 flex-col pb-4">
            {categories.map(item => (
              <CategoryListItem
                key={item.id}
                item={item}
                setDeleteConfirmationModalOpen={
                  setDeleteCategoryConfirmationModalOpen
                }
                setModifyModalOpenType={setModifyCategoryModalOpenType}
                setSelectedData={setExistedData}
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
