import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import { type IYoutubeVideoInfo } from '@interfaces/youtube_video_storage_interfaces'
import fetchAPI from '@utils/fetchAPI'
import DownloadProcessModal from './DownloadProcessModal'

function Header({
  videosLength,
  refreshVideos,
  setIsAddVideosModalOpen,
  query,
  setQuery,
  needsProgressCheck,
  setNeedsProgressCheck,
  isAddVideosModalOpen
}: {
  videosLength: number
  refreshVideos: () => void
  setIsAddVideosModalOpen: (value: boolean) => void
  query: string
  setQuery: (value: string) => void
  needsProgressCheck: boolean
  setNeedsProgressCheck: (value: boolean) => void
  isAddVideosModalOpen: boolean
}): React.ReactElement {
  const { t } = useTranslation('modules.youtubeVideos')
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

  async function checkProgress(): Promise<void> {
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
          refreshVideos()
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
              refreshVideos()
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
              variant="no-bg"
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
            onClick={refreshVideos}
          />
        }
        icon="tabler:brand-youtube"
        title="Youtube Videos"
        totalItems={videosLength}
      />
      <SearchInput
        namespace="modules.youtubeVideos"
        searchQuery={query}
        setSearchQuery={setQuery}
        stuffToSearch="video"
      />
      <DownloadProcessModal
        isOpen={isDownloadProcessModalOpen}
        processes={processes}
        onClose={() => {
          setIsDownloadProcessModalOpen(false)
          refreshVideos()
        }}
      />
    </>
  )
}

export default Header
