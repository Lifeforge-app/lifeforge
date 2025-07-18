import { useQueryClient } from '@tanstack/react-query'
import { Button, MenuItem, ModuleHeader, SearchInput } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { fetchAPI } from 'shared/lib'

import { type IYoutubeVideoInfo } from '../interfaces/youtube_video_storage_interfaces'
import DownloadProcessModal from '../modals/DownloadProcessModal'

function Header({
  videosLength,
  query,
  setQuery,
  needsProgressCheck,
  setNeedsProgressCheck,
  handleOpenAddVideosModal
}: {
  videosLength: number
  query: string
  setQuery: (value: string) => void
  needsProgressCheck: boolean
  setNeedsProgressCheck: (value: boolean) => void
  handleOpenAddVideosModal: () => void
}) {
  const stack = useModalStore(state => state.stack)
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.youtubeVideos')
  const [processes, setProcesses] = useState<
    Record<
      string,
      {
        status: 'completed' | 'failed' | 'in_progress'
        progress: number
        metadata: IYoutubeVideoInfo
      }
    >
  >({})
  const [isFirstTime, setIsFirstTime] = useState(true)

  async function checkProgress() {
    if (!needsProgressCheck && !isFirstTime) return
    setIsFirstTime(false)

    try {
      const processes = await fetchAPI<
        Record<
          string,
          {
            status: 'completed' | 'failed' | 'in_progress'
            progress: number
            metadata: IYoutubeVideoInfo
          }
        >
      >(import.meta.env.VITE_API_HOST, 'youtube-videos/video/download-status', {
        method: 'POST',
        body: { id: 'all' }
      })

      if (
        (Object.keys(processes).length !== 0 &&
          !Object.values(processes).every(p => p.status === 'in_progress')) ||
        Object.keys(processes).length === 0
      ) {
        if (!isFirstTime) {
          queryClient.invalidateQueries({
            queryKey: ['youtube-videos', 'video']
          })
        }
        setNeedsProgressCheck(false)
      }
      setProcesses(processes)
    } catch {
      setNeedsProgressCheck(false)
      toast.error(t('input.error.failed'))
    }
  }

  const handleOpenDownloadProgressModal = useCallback(() => {
    open(DownloadProcessModal, { processes })
  }, [processes])

  useEffect(() => {
    const interval = setInterval(checkProgress, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [needsProgressCheck, isFirstTime, stack.length])

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden whitespace-nowrap md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.video') }}
            onClick={handleOpenAddVideosModal}
          >
            new
          </Button>
        }
        customElement={
          Object.entries(processes).some(
            ([, { status }]) => status === 'in_progress'
          ) && (
            <Button
              className="p-5"
              icon="tabler:download"
              variant="plain"
              onClick={handleOpenDownloadProgressModal}
            >
              (
              {
                Object.entries(processes).filter(
                  ([, { status }]) => status === 'in_progress'
                ).length
              }
              )
            </Button>
          )
        }
        hamburgerMenuItems={
          <MenuItem
            icon="tabler:refresh"
            text="Refresh"
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['youtube-videos', 'video']
              })
            }}
          />
        }
        icon="tabler:brand-youtube"
        title="Youtube Videos"
        totalItems={videosLength}
      />
      <SearchInput
        namespace="apps.youtubeVideos"
        searchQuery={query}
        setSearchQuery={setQuery}
        stuffToSearch="video"
      />
    </>
  )
}

export default Header
