import React from 'react'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import { type IProjectsMCategory } from '@interfaces/projects_m_interfaces'
import CategoryItem from './CategoryItem'

function CategorySection({
  categories,
  setExistedData,
  setModifyCategoriesModalOpenType,
  setSidebarOpen,
  setDeleteCategoriesConfirmationOpen
}: {
  categories: IProjectsMCategory[] | 'loading' | 'error'
  setExistedData: React.Dispatch<
    React.SetStateAction<IProjectsMCategory | null>
  >
  setModifyCategoriesModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteCategoriesConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <>
      <SidebarTitle
        name="category"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setExistedData(null)
          setModifyCategoriesModalOpenType('create')
        }}
      />
      <APIComponentWithFallback data={categories}>
        {typeof categories !== 'string' &&
          (categories.length > 0 ? (
            categories.map(item => (
              <CategoryItem
                key={item.id}
                item={item}
                setExistedData={setExistedData}
                setModifyModalOpenType={setModifyCategoriesModalOpenType}
                setSidebarOpen={setSidebarOpen}
                setDeleteConfirmationModalOpen={
                  setDeleteCategoriesConfirmationOpen
                }
              />
            ))
          ) : (
            <p className="text-center text-bg-500">No category found.</p>
          ))}
      </APIComponentWithFallback>
    </>
  )
}

export default CategorySection
