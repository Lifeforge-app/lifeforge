import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import GoBackButton from '@components/ButtonsAndInputs/GoBackButton'
import Scrollbar from '@components/Scrollbar'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import {
  type IProjectsMStatus,
  type IProjectsMCategory
} from '@interfaces/projects_m_interfaces'
import CategorySection from './components/CategorySection'
import StatusSection from './components/StatusSection'

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  categories,
  statuses,
  setModifyCategoriesModalOpenType,
  setExistedCategoryData,
  setModifyStatusModalOpenType,
  setExistedStatusData
}: {
  sidebarOpen: boolean
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  categories: IProjectsMCategory[] | 'loading' | 'error'
  statuses: IProjectsMStatus[] | 'loading' | 'error'
  setModifyCategoriesModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedCategoryData: React.Dispatch<
    React.SetStateAction<IProjectsMCategory | null>
  >
  setModifyStatusModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setExistedStatusData: React.Dispatch<
    React.SetStateAction<IProjectsMStatus | null>
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
          />
          <SidebarDivider />
          <StatusSection
            statuses={statuses}
            setExistedData={setExistedStatusData}
            setModifyStatusModalOpenType={setModifyStatusModalOpenType}
            setSidebarOpen={setSidebarOpen}
          />
          <SidebarDivider />
          <SidebarTitle name="visibility" />
          {[
            ['tabler:brand-open-source', 'Open Source'],
            ['tabler:briefcase', 'Private & Commercial']
          ].map(([icon, name], index) => (
            <li
              key={index}
              className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
            >
              <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                <Icon icon={icon} className="size-6 shrink-0" />
                <div className="flex w-full items-center justify-between">
                  {name}
                </div>
                <span className="text-sm">
                  {Math.floor(Math.random() * 10)}
                </span>
              </div>
            </li>
          ))}
          <SidebarDivider />
          <SidebarTitle name="Technologies" />
          {[
            ['simple-icons:react', 'React'],
            ['simple-icons:angular', 'Angular'],
            ['simple-icons:electron', 'Electron'],
            ['simple-icons:python', 'Python'],
            ['simple-icons:swift', 'Swift'],
            ['simple-icons:android', 'Android'],
            ['simple-icons:apple', 'iOS'],
            ['simple-icons:windows', 'Windows'],
            ['simple-icons:linux', 'Linux']
          ].map(([icon, name], index) => (
            <li
              key={index}
              className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
            >
              <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                <Icon icon={icon} className="size-5 shrink-0" />
                <div className="flex w-full items-center justify-between">
                  {name}
                </div>
                <span className="text-sm">
                  {Math.floor(Math.random() * 10)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </Scrollbar>
    </aside>
  )
}

export default Sidebar
