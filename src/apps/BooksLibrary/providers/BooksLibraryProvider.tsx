import { UseQueryResult, useQueryClient } from '@tanstack/react-query'
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

import useAPIQuery from '@hooks/useAPIQuery'

import fetchAPI from '@utils/fetchAPI'

import {
  type IBooksLibraryCategory,
  type IBooksLibraryEntry,
  type IBooksLibraryFileType,
  type IBooksLibraryLanguage
} from '../interfaces/books_library_interfaces'

interface IBooksLibraryData {
  entriesQuery: UseQueryResult<IBooksLibraryEntry[]>
  categoriesQuery: UseQueryResult<IBooksLibraryCategory[]>
  languagesQuery: UseQueryResult<IBooksLibraryLanguage[]>
  fileTypesQuery: UseQueryResult<IBooksLibraryFileType[]>
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
  const entriesQuery = useAPIQuery<IBooksLibraryEntry[]>(
    'books-library/entries',
    ['books-library', 'entries']
  )
  const categoriesQuery = useAPIQuery<IBooksLibraryCategory[]>(
    'books-library/categories',
    ['books-library', 'categories']
  )
  const languagesQuery = useAPIQuery<IBooksLibraryLanguage[]>(
    'books-library/languages',
    ['books-library', 'languages']
  )
  const fileTypesQuery = useAPIQuery<IBooksLibraryFileType[]>(
    'books-library/file-types',
    ['books-library', 'fileTypes']
  )
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
      entriesQuery,
      categoriesQuery,
      languagesQuery,
      fileTypesQuery,
      miscellaneous: {
        processes,
        searchQuery,
        setSearchQuery,
        sidebarOpen,
        setSidebarOpen,
        libgenModalOpen,
        setLibgenModalOpen
      }
    }),
    [
      entriesQuery,
      categoriesQuery,
      languagesQuery,
      fileTypesQuery,
      processes,
      searchQuery,
      sidebarOpen,
      libgenModalOpen
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
