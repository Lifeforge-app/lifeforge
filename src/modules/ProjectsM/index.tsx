import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  type IProjectsMStatus,
  type IProjectsMCategory,
  type IProjectsMVisibility,
  type IProjectsMTechnology
} from '@interfaces/projects_m_interfaces'
import ModifyCategoriesModal from './components/ModifyCategoryModal'
import ModifyStatusModal from './components/ModifyStatusModal'
import ModifyTechnologyModal from './components/ModifyTechnologyModal'
import ModifyVisibilityModal from './components/ModifyVisibilityModal'
import Sidebar from './components/Sidebar'

function ProjectsM(): React.ReactElement {
  const [categories, refreshCategories] = useFetch<IProjectsMCategory[]>(
    'projects-m/category'
  )
  const [statuses, refreshStatuses] =
    useFetch<IProjectsMStatus[]>('projects-m/status')
  const [visibilities, refreshVisibilities] = useFetch<IProjectsMVisibility[]>(
    'projects-m/visibility'
  )
  const [technologies, refreshTechnologies] = useFetch<IProjectsMTechnology[]>(
    'projects-m/technology'
  )
  const [icons, setIcons] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modifyCategoriesModalOpenType, setModifyCategoriesModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedCategoryData, setExistedCategoryData] =
    useState<IProjectsMCategory | null>(null)
  const [modifyStatusModalOpenType, setModifyStatusModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedStatusData, setExistedStatusData] =
    useState<IProjectsMStatus | null>(null)
  const [modifyVisibilityModalOpenType, setModifyVisibilityModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedVisibilityData, setExistedVisibilityData] =
    useState<IProjectsMCategory | null>(null)
  const [modifyTechnologyModalOpenType, setModifyTechnologyModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedTechnologyData, setExistedTechnologyData] =
    useState<IProjectsMTechnology | null>(null)

  useEffect(() => {
    fetch('http://api.iconify.design/collection?prefix=tabler')
      .then(async response => await response.json())
      .then(data => {
        setIcons(data.uncategorized)
      })
      .catch(() => {})
  }, [])

  return (
    <ModuleWrapper>
      <ModuleHeader
        title="Projects (M)"
        desc="It's time to stop procrastinating."
      />
      <div className="mt-6 flex size-full min-h-0 flex-1">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          categories={categories}
          statuses={statuses}
          visibilities={visibilities}
          technologies={technologies}
          setModifyCategoriesModalOpenType={setModifyCategoriesModalOpenType}
          setExistedCategoryData={setExistedCategoryData}
          setModifyStatusModalOpenType={setModifyStatusModalOpenType}
          setExistedStatusData={setExistedStatusData}
          setModifyVisibilityModalOpenType={setModifyVisibilityModalOpenType}
          setExistedVisibilityData={setExistedVisibilityData}
          setModifyTechnologyModalOpenType={setModifyTechnologyModalOpenType}
          setExistedTechnologyData={setExistedTechnologyData}
        />
        <div className="relative z-10 flex h-full flex-1 flex-col lg:ml-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold lg:text-4xl">
              All Projects <span className="text-base text-bg-500">(10)</span>
            </h1>
            <div className="flex items-center gap-6">
              <Button
                onClick={() => {}}
                className="hidden sm:flex"
                icon="tabler:plus"
              >
                new task
              </Button>
              <button
                onClick={() => {
                  setSidebarOpen(true)
                }}
                className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
              >
                <Icon icon="tabler:menu" className="text-2xl" />
              </button>
            </div>
          </div>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            stuffToSearch="projects"
          />
          <div className="mt-6 flex flex-1 flex-col">
            <Scrollbar>
              <ul className="mb-8 flex flex-col">
                {Array(10)
                  .fill(0)
                  .map((_, i) => (
                    <li
                      key={i}
                      className="m-4 mt-0 flex items-center gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900"
                    >
                      <Link
                        to="./lifeforge"
                        className="flex w-full items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`h-10 w-1 shrink-0 rounded-full ${
                              ['bg-green-500', 'bg-yellow-500', 'bg-red-500'][
                                Math.floor(Math.random() * 3)
                              ]
                            }`}
                          />
                          <div
                            className={`size-12 shrink-0 overflow-hidden rounded-lg p-2 ${
                              [
                                'bg-red-500/20 text-red-500',
                                'bg-yellow-500/20 text-yellow-500',
                                'bg-green-500/20 text-green-500',
                                'bg-blue-500/20 text-blue-500',
                                'bg-indigo-500/20 text-indigo-500',
                                'bg-purple-500/20 text-purple-500',
                                'bg-pink-500/20 text-pink-500',
                                'bg-rose-500/20 text-rose-500',
                                'bg-fuchsia-500/20 text-fuchsia-500',
                                'bg-orange-500/20 text-orange-500',
                                'bg-cyan-500/20 text-cyan-500',
                                'bg-sky-500/20 text-sky-500',
                                'bg-lime-500/20 text-lime-500',
                                'bg-amber-500/20 text-amber-500',
                                'bg-emerald-500/20 text-emerald-500',
                                'bg-custom-500/20 text-custom-500'
                              ][Math.floor(Math.random() * 16)]
                            }`}
                          >
                            <Icon
                              icon={`tabler:${
                                icons[
                                  Math.floor(Math.random() * icons.length)
                                ] as string
                              }`}
                              className="size-full"
                            />
                          </div>
                          <div className="flex flex-col items-start">
                            <div className="font-semibold ">Lorem Ipsum</div>
                            <div className="text-sm text-bg-500">
                              {
                                ['Website', 'Mobile App', 'Desktop App'][
                                  Math.floor(Math.random() * 3)
                                ]
                              }
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ">
                          <Icon
                            icon="tabler:chevron-right"
                            className="size-5 stroke-[2px] text-bg-500"
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
              </ul>
            </Scrollbar>
          </div>
        </div>
      </div>
      <ModifyCategoriesModal
        openType={modifyCategoriesModalOpenType}
        setOpenType={setModifyCategoriesModalOpenType}
        existedData={existedCategoryData}
        setExistedData={setExistedCategoryData}
        refreshCategories={refreshCategories}
      />
      <ModifyStatusModal
        openType={modifyStatusModalOpenType}
        setOpenType={setModifyStatusModalOpenType}
        existedData={existedStatusData}
        setExistedData={setExistedStatusData}
        refreshStatuses={refreshStatuses}
      />
      <ModifyVisibilityModal
        openType={modifyVisibilityModalOpenType}
        setOpenType={setModifyVisibilityModalOpenType}
        existedData={existedVisibilityData}
        setExistedData={setExistedVisibilityData}
        refreshVisibilities={refreshVisibilities}
      />
      <ModifyTechnologyModal
        openType={modifyTechnologyModalOpenType}
        setOpenType={setModifyTechnologyModalOpenType}
        existedData={existedTechnologyData}
        setExistedData={setExistedTechnologyData}
        refreshTechnologies={refreshTechnologies}
      />
    </ModuleWrapper>
  )
}

export default ProjectsM
