import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  EmptyStateScreen,
  FAB,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import AddVideosModal from './components/AddVideosModal'
import Header from './components/Header'
import VideoList from './components/VideoList'
import { type IYoutubeVideosStorageEntry } from './interfaces/youtube_video_storage_interfaces'

function YoutubeVideos() {
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.youtubeVideos')
  const [isAddVideosModalOpen, setIsAddVideosModalOpen] = useState(false)
  const videosQuery = useAPIQuery<IYoutubeVideosStorageEntry[]>(
    'youtube-videos/video',
    ['youtube-videos', 'video']
  )

  const [needsProgressCheck, setNeedsProgressCheck] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [filteredVideos, setFilteredVideos] = useState<
    IYoutubeVideosStorageEntry[]
  >([])

  useEffect(() => {
    if (!videosQuery.data) {
      setFilteredVideos([])
      return
    }

    setFilteredVideos(
      videosQuery.data.filter(
        v =>
          v.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          v.channel?.name.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
    )
  }, [videosQuery.data, debouncedQuery])

  return (
    <ModuleWrapper>
      <Header
        isAddVideosModalOpen={isAddVideosModalOpen}
        needsProgressCheck={needsProgressCheck}
        query={query}
        setIsAddVideosModalOpen={setIsAddVideosModalOpen}
        setNeedsProgressCheck={setNeedsProgressCheck}
        setQuery={setQuery}
        videosLength={videosQuery.data?.length ?? 0}
      />
      <Scrollbar className="mt-6">
        <QueryWrapper query={videosQuery}>
          {videos =>
            videos.length === 0 ? (
              <EmptyStateScreen
                ctaContent="new"
                ctaTProps={{
                  item: t('items.video')
                }}
                icon="tabler:movie-off"
                name="videos"
                namespace="apps.youtubeVideos"
                onCTAClick={() => {
                  queryClient.invalidateQueries({
                    queryKey: ['youtube-videos', 'video']
                  })
                  setIsAddVideosModalOpen(true)
                }}
              />
            ) : (
              <QueryWrapper query={videosQuery}>
                {() =>
                  filteredVideos.length === 0 ? (
                    <EmptyStateScreen
                      icon="tabler:search-off"
                      name="results"
                      namespace="apps.youtubeVideos"
                    />
                  ) : (
                    <VideoList videos={filteredVideos} />
                  )
                }
              </QueryWrapper>
            )
          }
        </QueryWrapper>
      </Scrollbar>
      <AddVideosModal
        isOpen={isAddVideosModalOpen}
        videos={videosQuery.data ?? []}
        onClose={(isVideoDownloading: boolean) => {
          setIsAddVideosModalOpen(false)
          if (isVideoDownloading) {
            setNeedsProgressCheck(true)
          }
        }}
      />
      <FAB
        hideWhen="md"
        onClick={() => {
          queryClient.invalidateQueries({
            queryKey: ['youtube-videos', 'video']
          })
          setIsAddVideosModalOpen(true)
        }}
      />
    </ModuleWrapper>
  )
}

export default YoutubeVideos
