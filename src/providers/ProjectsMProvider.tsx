import React, { useContext, useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import useFetch from '@hooks/useFetch'
import {
  type IProjectsMCategory,
  type IProjectsMEntry,
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility
} from '@interfaces/projects_m_interfaces'
import { useGlobalStateContext } from './GlobalStateProvider'

interface IProjectsMData {
  entries: {
    data: IProjectsMEntry[] | 'loading' | 'error'
    refreshData: () => void
    modifyDataModalOpenType: 'create' | 'update' | null
    setModifyDataModalOpenType: React.Dispatch<
      React.SetStateAction<'create' | 'update' | null>
    >
    existedData: IProjectsMEntry | null
    setExistedData: React.Dispatch<React.SetStateAction<IProjectsMEntry | null>>
    deleteDataConfirmationModalOPen: boolean
    setDeleteDataConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  categories: {
    data: IProjectsMCategory[] | 'loading' | 'error'
    refreshData: () => void
    modifyDataModalOpenType: 'create' | 'update' | null
    setModifyDataModalOpenType: React.Dispatch<
      React.SetStateAction<'create' | 'update' | null>
    >
    existedData: IProjectsMCategory | null
    setExistedData: React.Dispatch<
      React.SetStateAction<IProjectsMCategory | null>
    >
    deleteDataConfirmationModalOPen: boolean
    setDeleteDataConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  statuses: {
    data: IProjectsMStatus[] | 'loading' | 'error'
    refreshData: () => void
    modifyDataModalOpenType: 'create' | 'update' | null
    setModifyDataModalOpenType: React.Dispatch<
      React.SetStateAction<'create' | 'update' | null>
    >
    existedData: IProjectsMStatus | null
    setExistedData: React.Dispatch<
      React.SetStateAction<IProjectsMStatus | null>
    >
    deleteDataConfirmationModalOPen: boolean
    setDeleteDataConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  visibilities: {
    data: IProjectsMVisibility[] | 'loading' | 'error'
    refreshData: () => void
    modifyDataModalOpenType: 'create' | 'update' | null
    setModifyDataModalOpenType: React.Dispatch<
      React.SetStateAction<'create' | 'update' | null>
    >
    existedData: IProjectsMCategory | null
    setExistedData: React.Dispatch<
      React.SetStateAction<IProjectsMCategory | null>
    >
    deleteDataConfirmationModalOPen: boolean
    setDeleteDataConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  technologies: {
    data: IProjectsMTechnology[] | 'loading' | 'error'
    refreshData: () => void
    modifyDataModalOpenType: 'create' | 'update' | null
    setModifyDataModalOpenType: React.Dispatch<
      React.SetStateAction<'create' | 'update' | null>
    >
    existedData: IProjectsMTechnology | null
    setExistedData: React.Dispatch<
      React.SetStateAction<IProjectsMTechnology | null>
    >
    deleteDataConfirmationModalOPen: boolean
    setDeleteDataConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
  }
  miscellaneous: {
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    sidebarOpen: boolean
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    modalConfigs: Array<{
      apiEndpoint: string
      isOpen: boolean
      data: any
      itemName: string
      nameKey: string
      setOpen: React.Dispatch<React.SetStateAction<boolean>>
      setData: React.Dispatch<React.SetStateAction<any>>
      updateDataList: () => void
    }>
  }
}

export const ProjectsMContext = React.createContext<IProjectsMData | undefined>(
  undefined
)

export default function ProjectsMProvider(): React.ReactElement {
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

  const modalConfigs = [
    {
      apiEndpoint: 'projects-m/entry',
      isOpen: deleteEntryConfirmationOpen,
      data: existedEntryData,
      itemName: 'project',
      nameKey: 'name',
      setOpen: setDeleteEntryConfirmationOpen,
      setData: setExistedEntryData,
      updateDataList: refreshEntries
    },
    {
      apiEndpoint: 'projects-m/category',
      isOpen: deleteCategoryConfirmationOpen,
      data: existedCategoryData,
      itemName: 'category',
      nameKey: 'name',
      setOpen: setDeleteCategoryConfirmationOpen,
      setData: setExistedCategoryData,
      updateDataList: refreshCategories
    },
    {
      apiEndpoint: 'projects-m/status',
      isOpen: deleteStatusConfirmationOpen,
      data: existedStatusData,
      itemName: 'status',
      nameKey: 'name',
      setOpen: setDeleteStatusConfirmationOpen,
      setData: setExistedStatusData,
      updateDataList: refreshStatuses
    },
    {
      apiEndpoint: 'projects-m/visibility',
      isOpen: deleteVisibilityConfirmationOpen,
      data: existedVisibilityData,
      itemName: 'visibility',
      nameKey: 'name',
      setOpen: setDeleteVisibilityConfirmationOpen,
      setData: setExistedVisibilityData,
      updateDataList: refreshVisibilities
    },
    {
      apiEndpoint: 'projects-m/technology',
      isOpen: deleteTechnologyConfirmationOpen,
      data: existedTechnologyData,
      itemName: 'technology',
      nameKey: 'name',
      setOpen: setDeleteTechnologyConfirmationOpen,
      setData: setExistedTechnologyData,
      updateDataList: refreshTechnologies
    }
  ]

  return (
    <ProjectsMContext
      value={{
        entries: {
          data: entries,
          refreshData: refreshEntries,
          modifyDataModalOpenType: modifyEntryModalOpenType,
          setModifyDataModalOpenType: setModifyEntryModalOpenType,
          existedData: existedEntryData,
          setExistedData: setExistedEntryData,
          deleteDataConfirmationModalOPen: deleteEntryConfirmationOpen,
          setDeleteDataConfirmationOpen: setDeleteEntryConfirmationOpen
        },
        categories: {
          data: categories,
          refreshData: refreshCategories,
          modifyDataModalOpenType: modifyCategoriesModalOpenType,
          setModifyDataModalOpenType: setModifyCategoriesModalOpenType,
          existedData: existedCategoryData,
          setExistedData: setExistedCategoryData,
          deleteDataConfirmationModalOPen: deleteCategoryConfirmationOpen,
          setDeleteDataConfirmationOpen: setDeleteCategoryConfirmationOpen
        },
        statuses: {
          data: statuses,
          refreshData: refreshStatuses,
          modifyDataModalOpenType: modifyStatusModalOpenType,
          setModifyDataModalOpenType: setModifyStatusModalOpenType,
          existedData: existedStatusData,
          setExistedData: setExistedStatusData,
          deleteDataConfirmationModalOPen: deleteStatusConfirmationOpen,
          setDeleteDataConfirmationOpen: setDeleteStatusConfirmationOpen
        },
        visibilities: {
          data: visibilities,
          refreshData: refreshVisibilities,
          modifyDataModalOpenType: modifyVisibilityModalOpenType,
          setModifyDataModalOpenType: setModifyVisibilityModalOpenType,
          existedData: existedVisibilityData,
          setExistedData: setExistedVisibilityData,
          deleteDataConfirmationModalOPen: deleteVisibilityConfirmationOpen,
          setDeleteDataConfirmationOpen: setDeleteVisibilityConfirmationOpen
        },
        technologies: {
          data: technologies,
          refreshData: refreshTechnologies,
          modifyDataModalOpenType: modifyTechnologyModalOpenType,
          setModifyDataModalOpenType: setModifyTechnologyModalOpenType,
          existedData: existedTechnologyData,
          setExistedData: setExistedTechnologyData,
          deleteDataConfirmationModalOPen: deleteTechnologyConfirmationOpen,
          setDeleteDataConfirmationOpen: setDeleteTechnologyConfirmationOpen
        },
        miscellaneous: {
          searchQuery,
          setSearchQuery,
          sidebarOpen,
          setSidebarOpen,
          modalConfigs
        }
      }}
    >
      <Outlet />
    </ProjectsMContext>
  )
}

export function useProjectsMContext(): IProjectsMData {
  const context = useContext(ProjectsMContext)
  if (context === undefined) {
    throw new Error('useTodoListContext must be used within a TodoListProvider')
  }
  return context
}
