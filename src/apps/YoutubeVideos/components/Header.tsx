import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { Button, MenuItem, ModuleHeader, SearchInput } from '@lifeforge/ui'

import fetchAPI from '@utils/fetchAPI'

import { type IYoutubeVideoInfo } from '../interfaces/youtube_video_storage_interfaces'
import DownloadProcessModal from './DownloadProcessModal'

function Header({
  videosLength,
  setIsAddVideosModalOpen,
  query,
  setQuery,
  needsProgressCheck,
  setNeedsProgressCheck,
  isAddVideosModalOpen
}: {
  videosLength: number
  setIsAddVideosModalOpen: (value: boolean) => void
  query: string
  setQuery: (value: string) => void
  needsProgressCheck: boolean
  setNeedsProgressCheck: (value: boolean) => void
  isAddVideosModalOpen: boolean
}) {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.youtubeVideos')
  const [isDownloadProcessModalOpen, setIsDownloadProcessModalOpen] =
    useState(false)
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
      >('youtube-videos/video/download-status', {
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

  useEffect(() => {
    const interval = setInterval(checkProgress, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [needsProgressCheck, isFirstTime, isAddVideosModalOpen])

  return (
    <>
      <ModuleHeader
        actionButton={
          <Button
            className="hidden whitespace-nowrap md:flex"
            icon="tabler:plus"
            tProps={{ item: t('items.video') }}
            onClick={() => {
              queryClient.invalidateQueries({
                queryKey: ['youtube-videos', 'video']
              })
              setIsAddVideosModalOpen(true)
            }}
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
              onClick={() => {
                setIsDownloadProcessModalOpen(true)
              }}
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
      <DownloadProcessModal
        isOpen={isDownloadProcessModalOpen}
        processes={processes}
        onClose={() => {
          setIsDownloadProcessModalOpen(false)
          queryClient.invalidateQueries({
            queryKey: ['youtube-videos', 'video']
          })
        }}
      />
    </>
  )
}

export default Header
