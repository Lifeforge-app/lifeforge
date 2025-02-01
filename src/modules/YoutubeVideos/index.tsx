import { useDebounce } from '@uidotdev/usehooks'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FAB } from '@components/buttons'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import DeleteConfirmationModal from '@components/modals/DeleteConfirmationModal'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { type Loadable } from '@interfaces/common'
import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'
import AddVideosModal from './components/AddVideosModal'
import Header from './components/Header'
import VideoList from './components/VideoList'

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
        videosLength={videos.length}
        refreshVideos={refreshVideos}
        setIsAddVideosModalOpen={setIsAddVideosModalOpen}
        query={query}
        setQuery={setQuery}
        needsProgressCheck={needsProgressCheck}
        setNeedsProgressCheck={setNeedsProgressCheck}
        isAddVideosModalOpen={isAddVideosModalOpen}
      />
      <Scrollbar className="mt-6">
        <APIFallbackComponent data={videos}>
          {videos =>
            videos.length === 0 ? (
              <EmptyStateScreen
                name="videos"
                namespace="modules.youtubeVideos"
                icon="tabler:movie-off"
                ctaContent="new"
                ctaTProps={{
                  item: t('items.video')
                }}
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
                      name="results"
                      namespace="modules.youtubeVideos"
                      icon="tabler:search-off"
                    />
                  ) : (
                    <VideoList
                      videos={videos}
                      setVideoToDelete={setVideoToDelete}
                      setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
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
        apiEndpoint="youtube-videos/video"
        itemName="video"
        nameKey="title"
        data={videoToDelete}
      />
      <FAB
        onClick={() => {
          refreshVideos()
          setIsAddVideosModalOpen(true)
        }}
        hideWhen="md"
      />
    </ModuleWrapper>
  )
}

export default YoutubeVideos
