/* eslint-disable @typescript-eslint/consistent-type-assertions */
import React, { useContext, useState } from 'react'
import { Outlet } from 'react-router'
import useFetch from '@hooks/useFetch'
import useHashParams from '@hooks/useHashParams'
import {
  type IProjectsMCategory,
  type IProjectsMEntry,
  type IProjectsMStatus,
  type IProjectsMTechnology,
  type IProjectsMVisibility
} from '@interfaces/projects_m_interfaces'

type ModifyModalOpenType = 'create' | 'update' | null

function useProjectsMCommonState<T>(endpoint: string): IProjectsMCommon<T> {
  const [data, refreshData] = useFetch<T[]>(endpoint)
  const [modifyDataModalOpenType, setModifyDataModalOpenType] =
    useState<ModifyModalOpenType>(null)
  const [existedData, setExistedData] = useState<T | null>(null)
  const [deleteDataConfirmationModalOpen, setDeleteDataConfirmationOpen] =
    useState(false)

  return {
    data,
    refreshData,
    modifyDataModalOpenType,
    setModifyDataModalOpenType,
    existedData,
    setExistedData,
    deleteDataConfirmationModalOpen,
    setDeleteDataConfirmationOpen
  }
}

interface IProjectsMCommon<T> {
  data: T[] | 'loading' | 'error'
  refreshData: () => void
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
    searchParams: URLSearchParams
    setSearchParams: (params: Record<string, string> | URLSearchParams) => void
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
      updateDataList: () => void
    }>
  }
}

export const ProjectsMContext = React.createContext<IProjectsMData | undefined>(
  undefined
)

export default function ProjectsMProvider(): React.ReactElement {
  const [searchParams, setSearchParams] = useHashParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const entriesState =
    useProjectsMCommonState<IProjectsMEntry>('projects-m/entries')
  const categoriesState = useProjectsMCommonState<IProjectsMCategory>(
    'projects-m/categories'
  )
  const statusesState = useProjectsMCommonState<IProjectsMStatus>(
    'projects-m/statuses'
  )
  const visibilitiesState = useProjectsMCommonState<IProjectsMVisibility>(
    'projects-m/visibilities'
  )
  const technologiesState = useProjectsMCommonState<IProjectsMTechnology>(
    'projects-m/technologies'
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
    setData: state.setExistedData,
    updateDataList: state.refreshData
  }))

  return (
    <ProjectsMContext
      value={{
        entries: entriesState,
        categories: categoriesState,
        statuses: statusesState,
        visibilities: visibilitiesState,
        technologies: technologiesState,
        miscellaneous: {
          searchParams,
          setSearchParams,
          searchQuery,
          setSearchQuery,
          sidebarOpen,
          setSidebarOpen,
          deleteModalConfigs
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
    throw new Error(
      'useProjectsMContext must be used within a ProjectsMProvider'
    )
  }
  return context
}
