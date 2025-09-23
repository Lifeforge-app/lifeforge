import {
  type SocketEvent,
  useSocketContext as useSocket
} from '@providers/SocketProvider'
import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

export type BooksLibraryEntry = InferOutput<
  typeof forgeAPI.booksLibrary.entries.list
>['items'][number]

export type BooksLibraryCollection = InferOutput<
  typeof forgeAPI.booksLibrary.collections.list
>[number]

export type BooksLibraryLanguage = InferOutput<
  typeof forgeAPI.booksLibrary.languages.list
>[number]

export type BooksLibraryFileType = InferOutput<
  typeof forgeAPI.booksLibrary.fileTypes.list
>[number]

interface IBooksLibraryData {
  miscellaneous: {
    processes: Record<
      string,
      | SocketEvent<
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
  }
}

export const BooksLibraryContext = createContext<IBooksLibraryData | undefined>(
  undefined
)

export default function BooksLibraryProvider() {
  const socket = useSocket()

  const queryClient = useQueryClient()

  const [processes, setProcesses] = useState<
    Record<
      string,
      | SocketEvent<
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
        data: SocketEvent<
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
        if (
          data.module !== 'booksLibrary' ||
          !data.description.startsWith('Adding')
        )
          return

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
            queryKey: ['booksLibrary']
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
      miscellaneous: {
        processes
      }
    }),
    [processes]
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
