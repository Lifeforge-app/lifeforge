import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import useFetch from '@hooks/useFetch'
import {
  type IProjectsMStatus,
  type IProjectsMCategory,
  type IProjectsMVisibility,
  type IProjectsMTechnology,
  type IProjectsMEntry
} from '@interfaces/projects_m_interfaces'
import { useGlobalStateContext } from '@providers/GlobalStateProvider'
import EntryItem from './components/EntryItem'
import Sidebar from './components/Sidebar'
import ModifyCategoriesModal from './modals/ModifyCategoryModal'
import ModifyEntryModal from './modals/ModifyEntryModal'
import ModifyStatusModal from './modals/ModifyStatusModal'
import ModifyTechnologyModal from './modals/ModifyTechnologyModal'
import ModifyVisibilityModal from './modals/ModifyVisibilityModal'

function ProjectsM(): React.ReactElement {
  const { setSubSidebarExpanded } = useGlobalStateContext()
  const [entries, refreshEntries] =
    useFetch<IProjectsMEntry[]>('projects-m/entry')
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
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [modifyEntryModalOpenType, setModifyEntryModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedEntryData, setExistedEntryData] =
    useState<IProjectsMEntry | null>(null)
  const [deleteEntryConfirmationOpen, setDeleteEntryConfirmationOpen] =
    useState(false)

  const [modifyCategoriesModalOpenType, setModifyCategoriesModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedCategoryData, setExistedCategoryData] =
    useState<IProjectsMCategory | null>(null)
  const [deleteCategoryConfirmationOpen, setDeleteCategoryConfirmationOpen] =
    useState(false)

  const [modifyStatusModalOpenType, setModifyStatusModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedStatusData, setExistedStatusData] =
    useState<IProjectsMStatus | null>(null)
  const [deleteStatusConfirmationOpen, setDeleteStatusConfirmationOpen] =
    useState(false)

  const [modifyVisibilityModalOpenType, setModifyVisibilityModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedVisibilityData, setExistedVisibilityData] =
    useState<IProjectsMCategory | null>(null)
  const [
    deleteVisibilityConfirmationOpen,
    setDeleteVisibilityConfirmationOpen
  ] = useState(false)

  const [modifyTechnologyModalOpenType, setModifyTechnologyModalOpenType] =
    useState<'create' | 'update' | null>(null)
  const [existedTechnologyData, setExistedTechnologyData] =
    useState<IProjectsMTechnology | null>(null)
  const [
    deleteTechnologyConfirmationOpen,
    setDeleteTechnologyConfirmationOpen
  ] = useState(false)

  useEffect(() => {
    setSubSidebarExpanded(sidebarOpen)
  }, [sidebarOpen])

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
          setDeleteCategoriesConfirmationOpen={
            setDeleteCategoryConfirmationOpen
          }
          setModifyStatusModalOpenType={setModifyStatusModalOpenType}
          setExistedStatusData={setExistedStatusData}
          setDeleteStatusConfirmationOpen={setDeleteStatusConfirmationOpen}
          setModifyVisibilityModalOpenType={setModifyVisibilityModalOpenType}
          setExistedVisibilityData={setExistedVisibilityData}
          setDeleteVisibilityConfirmationOpen={
            setDeleteVisibilityConfirmationOpen
          }
          setModifyTechnologyModalOpenType={setModifyTechnologyModalOpenType}
          setExistedTechnologyData={setExistedTechnologyData}
          setDeleteTechnologyConfirmationOpen={
            setDeleteTechnologyConfirmationOpen
          }
        />
        <div className="relative z-10 flex h-full flex-1 flex-col lg:ml-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold lg:text-4xl">
              All Projects <span className="text-base text-bg-500">(10)</span>
            </h1>
            <div className="flex items-center gap-6">
              <Button
                onClick={() => {
                  setModifyEntryModalOpenType('create')
                  setExistedEntryData(null)
                }}
                className="hidden sm:flex"
                icon="tabler:plus"
              >
                new project
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
            <APIComponentWithFallback data={entries}>
              {entries =>
                entries.length > 0 ? (
                  <Scrollbar>
                    <ul className="mb-8 flex flex-col">
                      {entries.map(entry => (
                        <EntryItem
                          key={entry.id}
                          entry={entry}
                          categories={categories}
                          statuses={statuses}
                          visibilities={visibilities}
                          technologies={technologies}
                          setExistedData={setExistedEntryData}
                          setModifyModalOpenType={setModifyEntryModalOpenType}
                          setDeleteEntryConfirmationOpen={
                            setDeleteEntryConfirmationOpen
                          }
                        />
                      ))}
                    </ul>
                  </Scrollbar>
                ) : (
                  <EmptyStateScreen
                    title="No Projects Found"
                    description='Create a new project by clicking the "New Project" button above.'
                    icon="tabler:clipboard-off"
                    ctaContent="New Project"
                  />
                )
              }
            </APIComponentWithFallback>
          </div>
        </div>
      </div>
      <ModifyEntryModal
        openType={modifyEntryModalOpenType}
        setOpenType={setModifyEntryModalOpenType}
        existedData={existedEntryData}
        setExistedData={setExistedEntryData}
        refreshEntries={refreshEntries}
        categories={categories}
        statuses={statuses}
        visibilities={visibilities}
        technologies={technologies}
      />
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
      <DeleteConfirmationModal
        apiEndpoint="projects-m/entry"
        isOpen={deleteEntryConfirmationOpen}
        data={existedEntryData}
        itemName="project"
        nameKey="name"
        onClose={() => {
          setDeleteEntryConfirmationOpen(false)
          setExistedEntryData(null)
        }}
        updateDataList={refreshEntries}
      />
      <DeleteConfirmationModal
        apiEndpoint="projects-m/category"
        isOpen={deleteCategoryConfirmationOpen}
        data={existedCategoryData}
        itemName="category"
        nameKey="name"
        onClose={() => {
          setDeleteCategoryConfirmationOpen(false)
          setExistedCategoryData(null)
        }}
        updateDataList={refreshCategories}
      />
      <DeleteConfirmationModal
        apiEndpoint="projects-m/status"
        isOpen={deleteStatusConfirmationOpen}
        data={existedStatusData}
        itemName="status"
        nameKey="name"
        onClose={() => {
          setDeleteStatusConfirmationOpen(false)
          setExistedStatusData(null)
        }}
        updateDataList={refreshStatuses}
      />
      <DeleteConfirmationModal
        apiEndpoint="projects-m/visibility"
        isOpen={deleteVisibilityConfirmationOpen}
        data={existedVisibilityData}
        itemName="visibility"
        nameKey="name"
        onClose={() => {
          setDeleteVisibilityConfirmationOpen(false)
          setExistedVisibilityData(null)
        }}
        updateDataList={refreshVisibilities}
      />
      <DeleteConfirmationModal
        apiEndpoint="projects-m/technology"
        isOpen={deleteTechnologyConfirmationOpen}
        data={existedTechnologyData}
        itemName="technology"
        nameKey="name"
        onClose={() => {
          setDeleteTechnologyConfirmationOpen(false)
          setExistedTechnologyData(null)
        }}
        updateDataList={refreshTechnologies}
      />
    </ModuleWrapper>
  )
}

export default ProjectsM
