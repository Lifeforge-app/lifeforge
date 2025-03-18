import { useQueryClient } from '@tanstack/react-query'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Outlet } from 'react-router'
import { toast } from 'react-toastify'

import { fetchAPI } from '@lifeforge/core'

import useAPIQuery from '@hooks/useAPIQuery'

import {
  type IBooksLibraryCategory,
  type IBooksLibraryEntry,
  type IBooksLibraryFileType,
  type IBooksLibraryLanguage
} from '../interfaces/books_library_interfaces'

type ModifyModalOpenType = 'create' | 'update' | null

function useBooksLibraryCommonState<T>(
  endpoint: string
): IBooksLibraryCommon<T> {
  const dataQuery = useAPIQuery<T[]>(endpoint, endpoint.split('/'))
  const [modifyDataModalOpenType, setModifyDataModalOpenType] =
    useState<ModifyModalOpenType>(null)
  const [existedData, setExistedData] = useState<T | null>(null)
  const [deleteDataConfirmationModalOpen, setDeleteDataConfirmationOpen] =
    useState(false)

  return {
    data: dataQuery.data ?? [],
    loading: dataQuery.isLoading,
    modifyDataModalOpenType,
    setModifyDataModalOpenType,
    existedData,
    setExistedData,
    deleteDataConfirmationModalOpen,
    setDeleteDataConfirmationOpen
  }
}

interface IBooksLibraryCommon<T> {
  data: T[]
  loading: boolean
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
  fileTypes: IBooksLibraryCommon<IBooksLibraryFileType>
  miscellaneous: {
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
    }>
  }
}

export const BooksLibraryContext = createContext<IBooksLibraryData | undefined>(
  undefined
)

export default function BooksLibraryProvider() {
  const queryClient = useQueryClient()
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
  const fileTypesState = useBooksLibraryCommonState<IBooksLibraryFileType>(
    'books-library/file-types'
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
    setData: state.setExistedData
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

  async function checkProgress() {
    try {
      const data = await fetchAPI<
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
      >('books-library/libgen/download-progresses')

      const processes = data

      if (JSON.stringify(processes) !== lastProcessesData.current) {
        setProcesses(processes)
        lastProcessesData.current = JSON.stringify(processes)
      }

      if (
        !isFirstTime &&
        lastProcessesLength !== null &&
        lastProcessesLength.current !== Object.keys(processes).length
      ) {
        queryClient.invalidateQueries({
          queryKey: ['books-library', 'entries']
        })
        queryClient.invalidateQueries({
          queryKey: ['books-library', 'file-types']
        })
      }
      lastProcessesLength.current = Object.keys(processes).length
      setIsFirstTime(false)
    } catch {
      toast.error('Failed to fetch download progress')
    }
  }

  useEffect(() => {
    const interval = setInterval(checkProgress, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [isFirstTime])

  const value = useMemo(
    () => ({
      entries: entriesState,
      categories: categoriesState,
      languages: languagesState,
      fileTypes: fileTypesState,
      miscellaneous: {
        processes,
        searchQuery,
        setSearchQuery,
        sidebarOpen,
        setSidebarOpen,
        libgenModalOpen,
        setLibgenModalOpen,
        deleteModalConfigs
      }
    }),
    [
      entriesState,
      categoriesState,
      languagesState,
      fileTypesState,
      processes,
      searchQuery,
      sidebarOpen,
      libgenModalOpen,
      deleteModalConfigs
    ]
  )

  return (
    <BooksLibraryContext value={value}>
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
