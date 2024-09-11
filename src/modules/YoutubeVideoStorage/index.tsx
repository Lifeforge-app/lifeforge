import { Icon } from '@iconify/react/dist/iconify.js'
import { useDebounce } from '@uidotdev/usehooks'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SearchInput from '@components/ButtonsAndInputs/SearchInput'
import DeleteConfirmationModal from '@components/Modals/DeleteConfirmationModal'
import ModuleHeader from '@components/Module/ModuleHeader'
import ModuleWrapper from '@components/Module/ModuleWrapper'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import Scrollbar from '@components/Scrollbar'
import { VIDEO_RESOLUTIONS } from '@constants/video_res'
import useFetch from '@hooks/useFetch'
import {
  type IYoutubeVideoInfo,
  type IYoutubeVideosStorageEntry
} from '@interfaces/youtube_video_storage_interfaces'
import APIRequest from '@utils/fetchData'
import IntervalManager from '@utils/intervalManager'
import { cleanFileSize } from '@utils/strings'
import AddVideosModal from './components/AddVideosModal'
import DownloadProcessModal from './components/downloadProcessModal'

const intervalManager = IntervalManager.getInstance()

function YoutubeVideoStorage(): React.ReactElement {
  const [isAddVideosModalOpen, setIsAddVideosModalOpen] = useState(false)
  const [videos, refreshVideos, setVideos] = useFetch<
    IYoutubeVideosStorageEntry[]
  >('/youtube-video-storage/video')
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false)
  const [videoToDelete, setVideoToDelete] =
    useState<IYoutubeVideosStorageEntry>()
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
  const [needsProgressCheck, setNeedsProgressCheck] = useState(true)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [filteredVideos, setFilteredVideos] = useState<
    IYoutubeVideosStorageEntry[] | 'loading' | 'error'
  >('loading')

  useEffect(() => {
    if (typeof videos === 'string') {
      setFilteredVideos(videos)
      return
    }

    setFilteredVideos(
      videos.filter(
        v =>
          v.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          v.channel?.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    )
  }, [videos, debouncedQuery])

  function checkProgress(): void {
    if (!needsProgressCheck && !isFirstTime) return
    setIsFirstTime(false)

    APIRequest({
      endpoint: 'youtube-video-storage/video/download-status',
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
    const interval = intervalManager.setInterval(checkProgress, 1000)

    return () => {
      intervalManager.clearInterval(interval)
    }
  }, [
    needsProgressCheck,
    isFirstTime,
    isAddVideosModalOpen,
    isDownloadProcessModalOpen
  ])

  return (
    <ModuleWrapper>
      <ModuleHeader
        icon="tabler:brand-youtube"
        title="Youtube Video Storage"
        desc="..."
        totalItems={videos?.length}
        actionButton={
          <Button
            icon="tabler:plus"
            onClick={() => {
              refreshVideos()
              setIsAddVideosModalOpen(true)
            }}
          >
            Add Video
          </Button>
        }
        hasHamburgerMenu
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
      <Scrollbar className="mt-8">
        <APIComponentWithFallback data={videos}>
          {videos =>
            videos.length === 0 ? (
              <EmptyStateScreen
                title="No videos available"
                description="There are no videos available at the moment. Consider adding some!"
                icon="tabler:movie-off"
                ctaContent="Add Video"
                onCTAClick={() => {
                  refreshVideos()
                  setIsAddVideosModalOpen(true)
                }}
              />
            ) : (
              <APIComponentWithFallback data={filteredVideos}>
                {videos => (
                  <div className="mb-16 flex-1 space-y-4">
                    {videos.length === 0 ? (
                      <EmptyStateScreen
                        title="No results found"
                        description="No videos found with the given search query."
                        icon="tabler:search-off"
                      />
                    ) : (
                      videos.map(video => (
                        <a
                          key={video.id}
                          href={`${
                            import.meta.env.VITE_API_HOST
                          }/youtube-video-storage/video/stream/${
                            video.youtube_id
                          }`}
                          target="_blank"
                          rel="noreferrer"
                          className="relative flex w-full items-center justify-between gap-8 rounded-md bg-bg-50 p-4 shadow-custom hover:bg-bg-200 dark:bg-bg-900 dark:hover:bg-bg-800/70"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative aspect-video w-56 shrink-0 overflow-hidden rounded-md border border-bg-800 bg-bg-800/70">
                              <Icon
                                icon="tabler:video"
                                className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-bg-700"
                              />
                              <img
                                src={`${
                                  import.meta.env.VITE_API_HOST
                                }/youtube-video-storage/video/thumbnail/${
                                  video.youtube_id
                                }`}
                                alt=""
                                className="relative -m-px rounded-md object-cover"
                              />
                              <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-bg-100">
                                {moment
                                  .utc(
                                    moment
                                      .duration(video.duration, 'seconds')
                                      .asMilliseconds()
                                  )
                                  .format(
                                    video.duration >= 3600 ? 'H:mm:ss' : 'm:ss'
                                  )}
                              </p>
                            </div>
                            <div className="flex flex-col justify-between">
                              <h3 className="text-xl font-semibold">
                                {video.title}
                              </h3>
                              <p className="mt-6 flex items-center gap-2 text-bg-500">
                                {video.channel !== undefined && (
                                  <p className="flex items-center gap-2">
                                    <img
                                      src={`${
                                        import.meta.env.VITE_API_HOST
                                      }/media/${video.channel.thumbnail}`}
                                      referrerPolicy="no-referrer"
                                      className="size-6 rounded-full"
                                    />
                                    {video.channel.name}
                                  </p>
                                )}
                                {video.upload_date !== '' && (
                                  <>
                                    <Icon
                                      icon="tabler:circle-filled"
                                      className="size-1"
                                    />
                                    <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
                                      <Icon
                                        icon="tabler:clock"
                                        className="mr-1 size-5"
                                      />
                                      {moment(video.upload_date).fromNow()}
                                    </p>
                                  </>
                                )}

                                <Icon
                                  icon="tabler:circle-filled"
                                  className="size-1"
                                />
                                <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
                                  <Icon
                                    icon="tabler:ruler"
                                    className="mr-1 size-5"
                                  />
                                  {(() => {
                                    const res = `${video.width}x${video.height}`

                                    if (
                                      Object.keys(VIDEO_RESOLUTIONS).includes(
                                        res
                                      )
                                    ) {
                                      return VIDEO_RESOLUTIONS[
                                        res as keyof typeof VIDEO_RESOLUTIONS
                                      ]
                                    }

                                    return res
                                  })()}
                                </p>
                                <Icon
                                  icon="tabler:circle-filled"
                                  className="size-1"
                                />
                                <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
                                  <Icon
                                    icon="tabler:file"
                                    className="mr-1 size-5"
                                  />
                                  {cleanFileSize(video.filesize)}
                                </p>
                              </p>
                            </div>
                          </div>
                          <HamburgerMenu className="absolute right-4 top-4">
                            <MenuItem
                              onClick={() => {
                                setVideoToDelete(video)
                                setIsConfirmDeleteModalOpen(true)
                              }}
                              text="Delete"
                              icon="tabler:trash"
                              isRed
                            />
                          </HamburgerMenu>
                        </a>
                      ))
                    )}
                  </div>
                )}
              </APIComponentWithFallback>
            )
          }
        </APIComponentWithFallback>
      </Scrollbar>
      <AddVideosModal
        isOpen={isAddVideosModalOpen}
        onClose={(isVideoDownloading: boolean) => {
          setIsAddVideosModalOpen(false)
          if (isVideoDownloading) {
            setNeedsProgressCheck(true)
          }
          refreshVideos()
        }}
        videos={videos}
      />
      <DeleteConfirmationModal
        isOpen={isConfirmDeleteModalOpen}
        onClose={() => {
          setIsConfirmDeleteModalOpen(false)
        }}
        customCallback={async () => {
          setVideos(prevVideos => {
            if (typeof prevVideos === 'string') return prevVideos
            if (videoToDelete === undefined) return prevVideos

            return prevVideos.filter(v => v.id !== videoToDelete.id)
          })
          setVideoToDelete(undefined)
        }}
        apiEndpoint="/youtube-video-storage/video"
        itemName="video"
        nameKey="title"
        data={videoToDelete}
      />
      <DownloadProcessModal
        isOpen={isDownloadProcessModalOpen}
        onClose={() => {
          setIsDownloadProcessModalOpen(false)
          refreshVideos()
        }}
        processes={processes}
      />
    </ModuleWrapper>
  )
}

export default YoutubeVideoStorage
