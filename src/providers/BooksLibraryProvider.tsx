/* eslint-disable @typescript-eslint/consistent-type-assertions */

import React, { useContext, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router'
import useFetch from '@hooks/useFetch'
import useHashParams from '@hooks/useHashParams'
import {
  type IBooksLibraryLanguage,
  type IBooksLibraryCategory,
  type IBooksLibraryEntry
} from '@interfaces/books_library_interfaces'
import APIRequest from '@utils/fetchData'

type ModifyModalOpenType = 'create' | 'update' | null

function useBooksLibraryCommonState<T>(
  endpoint: string
): IBooksLibraryCommon<T> {
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

interface IBooksLibraryCommon<T> {
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

interface IBooksLibraryData {
  entries: IBooksLibraryCommon<IBooksLibraryEntry>
  categories: IBooksLibraryCommon<IBooksLibraryCategory>
  languages: IBooksLibraryCommon<IBooksLibraryLanguage>
  miscellaneous: {
    searchParams: URLSearchParams
    setSearchParams: (params: Record<string, string> | URLSearchParams) => void
    processes: Record<
      string,
      {
        downloaded: string
        total: string
        percentage: string
        speed: string
        ETA: string
        metadata: Record<string, any>
      }
    >
    searchQuery: string
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>
    sidebarOpen: boolean
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    libgenModalOpen: boolean
    setLibgenModalOpen: React.Dispatch<React.SetStateAction<boolean>>
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

export const BooksLibraryContext = React.createContext<
  IBooksLibraryData | undefined
>(undefined)

export default function BooksLibraryProvider(): React.ReactElement {
  const [searchParams, setSearchParams] = useHashParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [libgenModalOpen, setLibgenModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const entriesState = useBooksLibraryCommonState<IBooksLibraryEntry>(
    'books-library/entries'
  )
  const categoriesState = useBooksLibraryCommonState<IBooksLibraryCategory>(
    'books-library/categories'
  )
  const languagesState = useBooksLibraryCommonState<IBooksLibraryLanguage>(
    'books-library/languages'
  )

  const deleteModalConfigs = Object.entries({
    category: categoriesState,
    language: languagesState
  } as Record<string, IBooksLibraryCommon<any>>).map(([key, state]) => ({
    apiEndpoint: `books-library/${key.replace(/y$/, 'ie')}s`,
    isOpen: state.deleteDataConfirmationModalOpen,
    data: state.existedData,
    itemName: key,
    nameKey: 'name',
    setOpen: state.setDeleteDataConfirmationOpen,
    setData: state.setExistedData,
    updateDataList: state.refreshData
  }))

  const lastProcessesLength = useRef<number | null>(null)
  const lastProcessesData = useRef<string | null>(null)
  const [isFirstTime, setIsFirstTime] = useState(true)

  const [processes, setProcesses] = useState<
    Record<
      string,
      {
        downloaded: string
        total: string
        percentage: string
        speed: string
        ETA: string
        metadata: Record<string, any>
      }
    >
  >({})

  function checkProgress(): void {
    APIRequest({
      endpoint: 'books-library/libgen/download-progresses',
      method: 'GET',
      failureInfo: 'Failed to get download status',
      callback(data) {
        if (data.state === 'success') {
          const processes = data.data as Record<
            string,
            {
              downloaded: string
              total: string
              percentage: string
              speed: string
              ETA: string
              metadata: Record<string, any>
            }
          >
          if (JSON.stringify(processes) !== lastProcessesData.current) {
            setProcesses(processes)
            lastProcessesData.current = JSON.stringify(processes)
          }

          if (
            !isFirstTime &&
            lastProcessesLength !== null &&
            lastProcessesLength.current !== Object.keys(processes).length
          ) {
            entriesState.refreshData()
          }
          lastProcessesLength.current = Object.keys(processes).length
          setIsFirstTime(false)
        }
      }
    }).catch(console.error)
  }

  useEffect(() => {
    const interval = setInterval(checkProgress, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isFirstTime])

  return (
    <BooksLibraryContext
      value={{
        entries: entriesState,
        categories: categoriesState,
        languages: languagesState,
        miscellaneous: {
          searchParams,
          setSearchParams,
          processes,
          searchQuery,
          setSearchQuery,
          sidebarOpen,
          setSidebarOpen,
          libgenModalOpen,
          setLibgenModalOpen,
          deleteModalConfigs
        }
      }}
    >
      <Outlet />
    </BooksLibraryContext>
  )
}

export function useBooksLibraryContext(): IBooksLibraryData {
  const context = useContext(BooksLibraryContext)
  if (context === undefined) {
    throw new Error(
      'BooksLibraryContext must be used within a BooksLibraryProvider'
    )
  }
  return context
}
