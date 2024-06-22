import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Scrollbar'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import {
  type IProjectsMStatus,
  type IProjectsMCategory,
  type IProjectsMTechnology,
  type IProjectsMVisibility
} from '@interfaces/projects_m_interfaces'
import CategorySection from './components/CategorySection'
import StatusSection from './components/StatusSection'
import TechnologySection from './components/TechnologySection'
import VisibilitySection from './components/VisibilitySection'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  categories,
  statuses,
  visibilities,
  technologies,
  setModifyCategoriesModalOpenType,
  setExistedCategoryData,
  setDeleteCategoriesConfirmationOpen,
  setModifyStatusModalOpenType,
  setExistedStatusData,
  setDeleteStatusConfirmationOpen,
  setModifyVisibilityModalOpenType,
  setExistedVisibilityData,
  setDeleteVisibilityConfirmationOpen,
  setModifyTechnologyModalOpenType,
  setExistedTechnologyData,
  setDeleteTechnologyConfirmationOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: IProjectsMCategory[] | 'loading' | 'error'
  statuses: IProjectsMStatus[] | 'loading' | 'error'
  visibilities: IProjectsMVisibility[] | 'loading' | 'error'
  technologies: IProjectsMTechnology[] | 'loading' | 'error'
  setModifyCategoriesModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedCategoryData: React.Dispatch<
    React.SetStateAction<IProjectsMCategory | null>
  >
  setDeleteCategoriesConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setModifyStatusModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedStatusData: React.Dispatch<
    React.SetStateAction<IProjectsMStatus | null>
  >
  setDeleteStatusConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
  setModifyVisibilityModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedVisibilityData: React.Dispatch<
    React.SetStateAction<IProjectsMVisibility | null>
  >
  setDeleteVisibilityConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setModifyTechnologyModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedTechnologyData: React.Dispatch<
    React.SetStateAction<IProjectsMTechnology | null>
  >
  setDeleteTechnologyConfirmationOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
}): React.ReactElement {
  return (
    <aside
      className={`absolute ${
        sidebarOpen ? 'left-0' : 'left-full'
      } top-0 z-[9999] size-full rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-2rem)] lg:w-1/4`}
    >
      <Scrollbar>
        <div className="flex items-center justify-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col">
          <SidebarItem icon="tabler:list" name="All Projects" />
          <SidebarItem icon="tabler:star-filled" name="Starred" />
          <SidebarDivider />
          <CategorySection
            categories={categories}
            setExistedData={setExistedCategoryData}
            setModifyCategoriesModalOpenType={setModifyCategoriesModalOpenType}
            setSidebarOpen={setSidebarOpen}
            setDeleteCategoriesConfirmationOpen={
              setDeleteCategoriesConfirmationOpen
            }
          />
          <SidebarDivider />
          <StatusSection
            statuses={statuses}
            setExistedData={setExistedStatusData}
            setModifyStatusModalOpenType={setModifyStatusModalOpenType}
            setSidebarOpen={setSidebarOpen}
            setDeleteStatusConfirmationOpen={setDeleteStatusConfirmationOpen}
          />
          <SidebarDivider />
          <VisibilitySection
            visibilities={visibilities}
            setExistedData={setExistedVisibilityData}
            setModifyVisibilityModalOpenType={setModifyVisibilityModalOpenType}
            setSidebarOpen={setSidebarOpen}
            setDeleteVisibilityConfirmationOpen={
              setDeleteVisibilityConfirmationOpen
            }
          />
          <SidebarDivider />
          <TechnologySection
            technologies={technologies}
            setExistedData={setExistedTechnologyData}
            setModifyTechnologyModalOpenType={setModifyTechnologyModalOpenType}
            setSidebarOpen={setSidebarOpen}
            setDeleteTechnologyConfirmationOpen={
              setDeleteTechnologyConfirmationOpen
            }
          />
        </ul>
      </Scrollbar>
    </aside>
  )
}

export default Sidebar
