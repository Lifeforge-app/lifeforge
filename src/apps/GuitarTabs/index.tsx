import { usePersonalization } from '@providers/PersonalizationProvider'
import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { parse as parseCookie } from 'cookie'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Id, toast } from 'react-toastify'

import {
  Button,
  ContentWrapperWithSidebar,
  DeleteConfirmationModal,
  LayoutWithSidebar,
  ModuleWrapper,
  Pagination,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import IntervalManager from '@utils/intervalManager'

import GuitarWorldModal from './components/GuitarWorldModal'
import Header from './components/Header'
import ModifyEntryModal from './components/ModifyEntryModal'
import Searchbar from './components/Searchbar'
import Sidebar from './components/Sidebar'
import {
  type IGuitarTabsEntry,
  type IGuitarTabsSidebarData
} from './interfaces/guitar_tabs_interfaces'
import Views from './views'

const intervalManager = IntervalManager.getInstance()

function GuitarTabs() {
  const { t } = useTranslation('apps.guitarTabs')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 500)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [isStarred, setStarred] = useState<boolean>(false)
  const [selectedSortType, setSelectedSortType] = useState<string>('newest')
  const queryKey = [
    'guitar-tabs',
    'entries',
    page,
    debouncedSearchQuery,
    selectedCategory,
    isStarred,
    selectedAuthor,
    selectedSortType
  ]

  const entriesQuery = useAPIQuery<{
    totalItems: number
    totalPages: number
    page: number
    items: IGuitarTabsEntry[]
  }>(
    `guitar-tabs/entries?page=${page}&query=${encodeURIComponent(
      debouncedSearchQuery.trim()
    )}&category=${selectedCategory ?? 'all'}${
      isStarred !== null ? '&starred=true' : ''
    }&author=${selectedAuthor ?? 'all'}&sort=${selectedSortType}`,
    queryKey
  )

  const sidebarDataQuery = useAPIQuery<IGuitarTabsSidebarData>(
    'guitar-tabs/entries/sidebar-data',
    ['guitar-tabs', 'sidebar-data']
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modifyEntryModalOpen, setModifyEntryModalOpen] = useState(false)
  const [existingEntry, setExistingEntry] = useState<IGuitarTabsEntry | null>(
    null
  )
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false)
  const [guitarWorldModalOpen, setGuitarWorldModalOpen] = useState(false)

  const queryClient = useQueryClient()
  const toastId = useRef<Id>(null)
  const { themeColor } = usePersonalization()

  const startInterval = useCallback(() => {
    intervalManager.setInterval(async () => {
      const { status, left, total } = await checkUploadStatus()

      switch (status) {
        case 'completed':
          if (toastId.current !== null) {
            toast.done(toastId.current)
            toastId.current = null
          }
          toast.success('Guitar tabs uploaded successfully!')
          intervalManager.clearAllIntervals()
          queryClient.invalidateQueries({ queryKey })
          break
        case 'in_progress':
          updateProgressBar((total - left) / total)
          break
        case 'failed':
          toast.error('Failed to upload guitar tabs!')
          intervalManager.clearAllIntervals()
          break
      }
    }, 1000)
  }, [queryClient, queryKey])

  const uploadFiles = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = '.pdf,.mp3,.mscz'
    input.onchange = async e => {
      const files = (e.target as HTMLInputElement).files

      const formData = new FormData()

      if (files === null) {
        return
      }

      if (files.length > 100) {
        toast.error('You can only upload 100 files at a time!')
        return
      }

      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], encodeURIComponent(files[i].name))
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_HOST}/guitar-tabs/entries/upload`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${parseCookie(document.cookie).session}`
            },
            body: formData
          }
        )

        if (res.status === 202) {
          const data = await res.json()
          if (data.state === 'accepted') {
            startInterval()
          }
        } else {
          const data = await res.json()
          throw new Error(
            `Failed to upload guitar tabs. Error: ${data.message}`
          )
        }
      } catch (error) {
        console.error(error)
        toast.error('Failed to upload guitar tabs')
      }
    }
    input.click()
  }, [queryKey])

  const checkUploadStatus = useCallback(async (): Promise<{
    status: 'completed' | 'failed' | 'in_progress'
    left: number
    total: number
  }> => {
    const res = await fetch(
      `${import.meta.env.VITE_API_HOST}/guitar-tabs/entries/process-status`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parseCookie(document.cookie).session}`
        }
      }
    )
    if (res.status === 200) {
      const data = await res.json()
      return data.data
    }
    return {
      status: 'failed',
      left: 0,
      total: 0
    }
  }, [])

  const updateProgressBar = useCallback(
    (progress: number) => {
      if (toastId.current === null) {
        toastId.current = toast('Upload in Progress', {
          progress,
          autoClose: false
        })
      } else {
        setTimeout(() => {
          if (toastId.current !== null) {
            toast.update(toastId.current, {
              progress,
              progressStyle: {
                background: themeColor
              }
            })
          }
        }, 0)
      }
    },
    [themeColor]
  )

  useEffect(() => {
    setPage(1)
  }, [debouncedSearchQuery])

  useEffect(() => {
    setPage(1)
  }, [selectedCategory, selectedAuthor, isStarred, selectedSortType])

  return (
    <ModuleWrapper>
      <Header
        setGuitarWorldModalOpen={setGuitarWorldModalOpen}
        setSortType={setSelectedSortType}
        setView={setView}
        sortType={selectedSortType}
        totalItems={entriesQuery.data?.totalItems}
        uploadFiles={uploadFiles}
        view={view}
      />
      <LayoutWithSidebar>
        <Sidebar
          author={selectedAuthor}
          category={selectedCategory}
          isOpen={sidebarOpen}
          setAuthor={setSelectedAuthor}
          setCategory={setSelectedCategory}
          setOpen={setSidebarOpen}
          setStarred={setStarred}
          sidebarDataQuery={sidebarDataQuery}
          starred={isStarred}
        />
        <ContentWrapperWithSidebar>
          <header className="flex-between flex w-full">
            <div className="flex min-w-0 items-end">
              <h1 className="truncate text-3xl font-semibold sm:text-4xl">
                {`${isStarred ? t('headers.starred') : ''} ${
                  selectedCategory !== null
                    ? t(`headers.${selectedCategory}`)
                    : ''
                } ${
                  !selectedAuthor && !selectedCategory && !isStarred
                    ? t('headers.all')
                    : ''
                } ${t('items.score')} ${
                  selectedAuthor !== null ? `by ${selectedAuthor}` : ''
                }`.trim()}
              </h1>
              <span className="text-bg-500 mr-8 ml-2 text-base">
                ({entriesQuery.data?.totalItems ?? 0})
              </span>
            </div>

            <Button
              className="lg:hidden"
              icon="tabler:menu"
              variant="plain"
              onClick={() => {
                setSidebarOpen(true)
              }}
            />
          </header>
          <Searchbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSortType={setSelectedSortType}
            setView={setView}
            sortType={selectedSortType}
            view={view}
          />
          <QueryWrapper query={entriesQuery}>
            {entries => (
              <Scrollbar className="mt-6 pb-16">
                <Pagination
                  className="mb-4"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={setPage}
                />
                <Views
                  debouncedSearchQuery={debouncedSearchQuery}
                  entries={entries.items}
                  queryKey={queryKey}
                  setDeleteConfirmationModalOpen={
                    setDeleteConfirmationModalOpen
                  }
                  setExistingEntry={setExistingEntry}
                  setModifyEntryModalOpen={setModifyEntryModalOpen}
                  totalItems={entries.totalItems}
                  view={view}
                />
                <Pagination
                  className="mt-4 pb-12"
                  currentPage={entries.page}
                  totalPages={entries.totalPages}
                  onPageChange={setPage}
                />
              </Scrollbar>
            )}
          </QueryWrapper>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
      <ModifyEntryModal
        existingItem={existingEntry}
        isOpen={modifyEntryModalOpen}
        queryKey={queryKey}
        onClose={() => {
          setModifyEntryModalOpen(false)
          setExistingEntry(null)
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="guitar-tabs/entries"
        data={existingEntry ?? undefined}
        isOpen={deleteConfirmationModalOpen}
        itemName="guitar tab"
        nameKey="title"
        queryKey={queryKey}
        queryUpdateType="invalidate"
        onClose={() => {
          setDeleteConfirmationModalOpen(false)
        }}
      />
      <GuitarWorldModal
        isOpen={guitarWorldModalOpen}
        onClose={() => {
          queryClient.invalidateQueries({ queryKey })
          queryClient.invalidateQueries({
            queryKey: ['guitar-tabs', 'sidebar-data']
          })
          setGuitarWorldModalOpen(false)
        }}
      />
    </ModuleWrapper>
  )
}

export default GuitarTabs
