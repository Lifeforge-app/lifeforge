import { UseQueryResult } from '@tanstack/react-query'
import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet } from 'react-router'

import {
  type IProjectsMCategory,
  type IProjectsMEntry,
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility
} from '@apps/ProjectsM/interfaces/projects_m_interfaces'

import useAPIQuery from '@hooks/useAPIQuery'

type ModifyModalOpenType = 'create' | 'update' | null

function useProjectsMCommonState<T>(
  endpoint: string,
  key: unknown[]
): IProjectsMCommon<T> {
  const dataQuery = useAPIQuery<T[]>(endpoint, key)
  const [modifyDataModalOpenType, setModifyDataModalOpenType] =
    useState<ModifyModalOpenType>(null)
  const [existedData, setExistedData] = useState<T | null>(null)
  const [deleteDataConfirmationModalOpen, setDeleteDataConfirmationOpen] =
    useState(false)

  return {
    dataQuery,
    modifyDataModalOpenType,
    setModifyDataModalOpenType,
    existedData,
    setExistedData,
    deleteDataConfirmationModalOpen,
    setDeleteDataConfirmationOpen
  }
}

interface IProjectsMCommon<T> {
  dataQuery: UseQueryResult<T[]>
  modifyDataModalOpenType: 'create' | 'update' | null
  setModifyDataModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  existedData: T | null
  setExistedData: React.Dispatch<React.SetStateAction<T | null>>
  deleteDataConfirmationModalOpen: boolean
  setDeleteDataConfirmationOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface IProjectsMData {
  entries: IProjectsMCommon<IProjectsMEntry>
  categories: IProjectsMCommon<IProjectsMCategory>
  statuses: IProjectsMCommon<IProjectsMStatus>
  visibilities: IProjectsMCommon<IProjectsMVisibility>
  technologies: IProjectsMCommon<IProjectsMTechnology>
  miscellaneous: {
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    sidebarOpen: boolean
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    deleteModalConfigs: Array<{
      apiEndpoint: string
      isOpen: boolean
      data: any
      itemName: string
      nameKey: string
      setOpen: React.Dispatch<React.SetStateAction<boolean>>
      setData: React.Dispatch<React.SetStateAction<any>>
    }>
  }
}

export const ProjectsMContext = createContext<IProjectsMData | undefined>(
  undefined
)

export default function ProjectsMProvider() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const entriesState = useProjectsMCommonState<IProjectsMEntry>(
    'projects-m/entries',
    ['projects-m', 'entries']
  )
  const categoriesState = useProjectsMCommonState<IProjectsMCategory>(
    'projects-m/categories',
    ['projects-m', 'categories']
  )
  const statusesState = useProjectsMCommonState<IProjectsMStatus>(
    'projects-m/statuses',
    ['projects-m', 'statuses']
  )
  const visibilitiesState = useProjectsMCommonState<IProjectsMVisibility>(
    'projects-m/visibilities',
    ['projects-m', 'visibilities']
  )
  const technologiesState = useProjectsMCommonState<IProjectsMTechnology>(
    'projects-m/technologies',
    ['projects-m', 'technologies']
  )

  const deleteModalConfigs = Object.entries({
    entry: entriesState,
    category: categoriesState,
    status: statusesState,
    visibility: visibilitiesState,
    technology: technologiesState
  } as Record<string, IProjectsMCommon<any>>).map(([key, state]) => ({
    apiEndpoint: `projects-m/${key.replace(/s$/, 'ses').replace(/y$/, 'ies')}`,
    isOpen: state.deleteDataConfirmationModalOpen,
    data: state.existedData,
    itemName: key,
    nameKey: 'name',
    setOpen: state.setDeleteDataConfirmationOpen,
    setData: state.setExistedData
  }))

  const value = useMemo(
    () => ({
      entries: entriesState,
      categories: categoriesState,
      statuses: statusesState,
      visibilities: visibilitiesState,
      technologies: technologiesState,
      miscellaneous: {
        searchQuery,
        setSearchQuery,
        sidebarOpen,
        setSidebarOpen,
        deleteModalConfigs
      }
    }),
    [
      entriesState,
      categoriesState,
      statusesState,
      visibilitiesState,
      technologiesState,
      searchQuery,
      sidebarOpen,
      deleteModalConfigs
    ]
  )

  return (
    <ProjectsMContext.Provider value={value}>
      <Outlet />
    </ProjectsMContext.Provider>
  )
}

export function useProjectsMContext(): IProjectsMData {
  const context = useContext(ProjectsMContext)
  if (context === undefined) {
    throw new Error(
      'useProjectsMContext must be used within a ProjectsMProvider'
    )
  }
  return context
}
