import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  APIFallbackComponent,
  DeleteConfirmationModal,
  EmptyStateScreen,
  FAB,
  Scrollbar
} from '@lifeforge/ui'
import { ModuleWrapper } from '@lifeforge/ui'

import { type Loadable } from '@interfaces/common'

import useFetch from '@hooks/useFetch'

import AddVideosModal from './components/AddVideosModal'
import Header from './components/Header'
import VideoList from './components/VideoList'
import { type IYoutubeVideosStorageEntry } from './interfaces/youtube_video_storage_interfaces'

function YoutubeVideos(): React.ReactElement {
  const { t } = useTranslation('modules.youtubeVideos')
  const [isAddVideosModalOpen, setIsAddVideosModalOpen] = useState(false)
  const [videos, refreshVideos, setVideos] = useFetch<
    IYoutubeVideosStorageEntry[]
  >('youtube-videos/video')
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false)
  const [videoToDelete, setVideoToDelete] =
    useState<IYoutubeVideosStorageEntry>()

  const [needsProgressCheck, setNeedsProgressCheck] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [filteredVideos, setFilteredVideos] =
    useState<Loadable<IYoutubeVideosStorageEntry[]>>('loading')

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

  return (
    <ModuleWrapper>
      <Header
        isAddVideosModalOpen={isAddVideosModalOpen}
        needsProgressCheck={needsProgressCheck}
        query={query}
        refreshVideos={refreshVideos}
        setIsAddVideosModalOpen={setIsAddVideosModalOpen}
        setNeedsProgressCheck={setNeedsProgressCheck}
        setQuery={setQuery}
        videosLength={videos.length}
      />
      <Scrollbar className="mt-6">
        <APIFallbackComponent data={videos}>
          {videos =>
            videos.length === 0 ? (
              <EmptyStateScreen
                ctaContent="new"
                ctaTProps={{
                  item: t('items.video')
                }}
                icon="tabler:movie-off"
                name="videos"
                namespace="modules.youtubeVideos"
                onCTAClick={() => {
                  refreshVideos()
                  setIsAddVideosModalOpen(true)
                }}
              />
            ) : (
              <APIFallbackComponent data={filteredVideos}>
                {videos =>
                  videos.length === 0 ? (
                    <EmptyStateScreen
                      icon="tabler:search-off"
                      name="results"
                      namespace="modules.youtubeVideos"
                    />
                  ) : (
                    <VideoList
                      setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
                      setVideoToDelete={setVideoToDelete}
                      videos={videos}
                    />
                  )
                }
              </APIFallbackComponent>
            )
          }
        </APIFallbackComponent>
      </Scrollbar>
      <AddVideosModal
        isOpen={isAddVideosModalOpen}
        videos={videos}
        onClose={(isVideoDownloading: boolean) => {
          setIsAddVideosModalOpen(false)
          if (isVideoDownloading) {
            setNeedsProgressCheck(true)
          }
          refreshVideos()
        }}
      />
      <DeleteConfirmationModal
        apiEndpoint="youtube-videos/video"
        customCallback={async () => {
          setVideos(prevVideos => {
            if (typeof prevVideos === 'string') return prevVideos
            if (videoToDelete === undefined) return prevVideos

            return prevVideos.filter(v => v.id !== videoToDelete.id)
          })
          setVideoToDelete(undefined)
        }}
        data={videoToDelete}
        isOpen={isConfirmDeleteModalOpen}
        itemName="video"
        nameKey="title"
        onClose={() => {
          setIsConfirmDeleteModalOpen(false)
        }}
      />
      <FAB
        hideWhen="md"
        onClick={() => {
          refreshVideos()
          setIsAddVideosModalOpen(true)
        }}
      />
    </ModuleWrapper>
  )
}

export default YoutubeVideos
