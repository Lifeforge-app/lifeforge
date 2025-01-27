import React, { useEffect, useState } from 'react'
import { Button } from '@components/buttons'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SearchInput } from '@components/inputs'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import { type IYoutubeVideoInfo } from '@interfaces/youtube_video_storage_interfaces'
import APIRequest from '@utils/fetchData'
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

  function checkProgress(): void {
    if (!needsProgressCheck && !isFirstTime) return
    setIsFirstTime(false)

    APIRequest({
      endpoint: 'youtube-videos/video/download-status',
      method: 'POST',
      failureInfo: 'Failed to get download status',
      body: { id: 'all' },
      callback(data) {
        if (data.state === 'success') {
          const processes = data.data as Record<
            string,
            {
              status: 'completed' | 'failed' | 'in_progress'
              progress: number
              metadata: IYoutubeVideoInfo
            }
          >

          if (
            (Object.keys(processes).length !== 0 &&
              !Object.values(processes).some(
                p => p.status === 'in_progress'
              )) ||
            Object.keys(processes).length === 0
          ) {
            if (!isFirstTime) {
              refreshVideos()
            }
            setNeedsProgressCheck(false)
          }
          setProcesses(processes)
        }
      }
    }).catch(console.error)
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
        icon="tabler:brand-youtube"
        title="Youtube Videos"
        totalItems={videosLength}
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              refreshVideos()
              setIsAddVideosModalOpen(true)
            }}
            className="hidden whitespace-nowrap md:flex"
          >
            Add Video
          </Button>
        }
        hamburgerMenuItems={
          <MenuItem
            icon="tabler:refresh"
            text="Refresh"
            onClick={refreshVideos}
          />
        }
        customElement={
          Object.entries(processes).some(
            ([, { status }]) => status === 'in_progress'
          ) && (
            <Button
              icon="tabler:download"
              variant="no-bg"
              className="p-5"
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
      />
      <SearchInput
        searchQuery={query}
        setSearchQuery={setQuery}
        stuffToSearch="videos"
      />
      <DownloadProcessModal
        isOpen={isDownloadProcessModalOpen}
        onClose={() => {
          setIsDownloadProcessModalOpen(false)
          refreshVideos()
        }}
        processes={processes}
      />
    </>
  )
}

export default Header
