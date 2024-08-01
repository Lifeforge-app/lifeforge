/* eslint-disable @typescript-eslint/consistent-type-assertions */
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
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const entriesState =
    useProjectsMCommonState<IProjectsMEntry>('projects-m/entries')
  const categoriesState = useProjectsMCommonState<IProjectsMCategory>(
    'projects-m/category'
  )
  const statusesState =
    useProjectsMCommonState<IProjectsMStatus>('projects-m/status')
  const visibilitiesState = useProjectsMCommonState<IProjectsMVisibility>(
    'projects-m/visibility'
  )
  const technologiesState = useProjectsMCommonState<IProjectsMTechnology>(
    'projects-m/technology'
  )

  useEffect(() => {
    setSubSidebarExpanded(sidebarOpen)
  }, [sidebarOpen])

  const modalConfigs = Object.entries({
    entry: entriesState,
    category: categoriesState,
    status: statusesState,
    visibility: visibilitiesState,
    technology: technologiesState
  } as Record<string, IProjectsMCommon<any>>).map(([key, state]) => ({
    apiEndpoint: `projects-m/${key}`,
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
