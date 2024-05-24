import { Icon } from '@iconify/react'
import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type ICalendarCategory } from '@typedec/Calendar'
import CategoryListItem from './components/CategoryListItem'

function CategoryList({
  categories,
  setModifyCategoryModalOpenType,
  setExistedData
}: {
  categories: ICalendarCategory[] | 'loading' | 'error'
  refreshCategories: () => void
  modifyCategoryModalOpenType: 'create' | 'update' | null
  setModifyCategoryModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedData: React.Dispatch<React.SetStateAction<ICalendarCategory | null>>
}): React.ReactElement {
  return (
    <>
      <section className="flex w-full min-w-0 flex-1 flex-col gap-4 overflow-y-auto rounded-lg bg-bg-50 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
        <div className="mt-4">
          <SidebarTitle
            name="Categories"
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() => {
              setModifyCategoryModalOpenType('create')
              setExistedData(null)
            }}
          />
        </div>
        <APIComponentWithFallback data={categories}>
          {typeof categories !== 'string' &&
            (categories.length > 0 ? (
              <ul className="-mt-2 flex h-full min-w-0 flex-col overflow-y-hidden pb-4 hover:overflow-y-scroll">
                {categories.map(item => (
                  <CategoryListItem
                    key={item.id}
                    item={item}
                    setModifyModalOpenType={setModifyCategoryModalOpenType}
                    setSelectedData={setExistedData}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-2">
                <Icon icon="tabler:article-off" className="h-12 w-12" />
                <p className="text-lg font-medium">
                  Oops, no categories found.
                </p>
                <p className="text-center text-sm text-bg-500">
                  You can create categories by clicking the plus button above.
                </p>
              </div>
            ))}
        </APIComponentWithFallback>
      </section>
    </>
  )
}

export default CategoryList
