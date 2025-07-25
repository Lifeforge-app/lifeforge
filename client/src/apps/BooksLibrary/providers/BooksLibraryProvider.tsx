import {
  ISocketEvent,
  useSocketContext as useSocket
} from '@providers/SocketProvider'
import { UseQueryResult, useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import { toast } from 'react-toastify'

import { useAPIQuery } from 'shared/lib'
import { BooksLibraryControllersSchemas } from 'shared/types/controllers'

interface IBooksLibraryData {
  entriesQuery: UseQueryResult<
    BooksLibraryControllersSchemas.IEntries['getAllEntries']['response']
  >
  collectionsQuery: UseQueryResult<
    BooksLibraryControllersSchemas.ICollection['getAllCollections']['response']
  >
  languagesQuery: UseQueryResult<
    BooksLibraryControllersSchemas.ILanguages['getAllLanguages']['response']
  >
  fileTypesQuery: UseQueryResult<
    BooksLibraryControllersSchemas.IFileTypes['getAllFileTypes']['response']
  >
  miscellaneous: {
    processes: Record<
      string,
      | ISocketEvent<
          Record<string, any>,
          {
            downloaded: string
            total: string
            percentage: string
            speed: string
            ETA: string
          }
        >
      | undefined
    >
    addToProcesses: (taskId: string) => void
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
  const socket = useSocket()

  const queryClient = useQueryClient()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [libgenModalOpen, setLibgenModalOpen] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')

  const entriesQuery = useAPIQuery<
    BooksLibraryControllersSchemas.IEntries['getAllEntries']['response']
  >('books-library/entries', ['books-library', 'entries'])

  const collectionsQuery = useAPIQuery<
    BooksLibraryControllersSchemas.ICollection['getAllCollections']['response']
  >('books-library/collections', ['books-library', 'collections'])

  const languagesQuery = useAPIQuery<
    BooksLibraryControllersSchemas.ILanguages['getAllLanguages']['response']
  >('books-library/languages', ['books-library', 'languages'])

  const fileTypesQuery = useAPIQuery<
    BooksLibraryControllersSchemas.IFileTypes['getAllFileTypes']['response']
  >('books-library/file-types', ['books-library', 'fileTypes'])

  const [processes, setProcesses] = useState<
    Record<
      string,
      | ISocketEvent<
          Record<string, any>,
          {
            downloaded: string
            total: string
            percentage: string
            speed: string
            ETA: string
          }
        >
      | undefined
    >
  >({})

  useEffect(() => {
    if (socket === null) return

    socket.on(
      'taskPoolUpdate',
      (
        data: ISocketEvent<
          Record<string, any>,
          {
            downloaded: string
            total: string
            percentage: string
            speed: string
            ETA: string
          }
        >
      ) => {
        if (data.module !== 'booksLibrary') return

        if (!processes[data.taskId]) {
          setProcesses(prev => ({
            ...prev,
            [data.taskId]: data
          }))
        }

        if (data.status === 'failed') {
          toast.error(`Download failed: ${data.error || 'Unknown error'}`)
          setProcesses(prev => {
            const newProcesses = { ...prev }

            delete newProcesses[data.taskId]

            return newProcesses
          })

          return
        }

        if (data.status === 'completed') {
          toast.success('Download completed successfully')
          setProcesses(prev => {
            const newProcesses = { ...prev }

            delete newProcesses[data.taskId]

            return newProcesses
          })
          queryClient.invalidateQueries({
            queryKey: ['books-library']
          })

          return
        }

        setProcesses(prev => ({
          ...prev,
          [data.taskId]: {
            ...data
          }
        }))
      }
    )

    return () => {
      socket.off('taskPoolUpdate')
    }
  }, [socket, processes, queryClient])

  const value = useMemo(
    () => ({
      entriesQuery,
      collectionsQuery,
      languagesQuery,
      fileTypesQuery,
      miscellaneous: {
        processes,
        addToProcesses: (taskId: string) => {
          if (!processes[taskId]) {
            setProcesses(prev => ({
              ...prev,
              [taskId]: undefined
            }))
          }
        },
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
      collectionsQuery,
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
