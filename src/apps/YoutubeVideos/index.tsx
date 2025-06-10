import { useQueryClient } from '@tanstack/react-query'
import { useDebounce } from '@uidotdev/usehooks'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  EmptyStateScreen,
  FAB,
  ModuleWrapper,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'
import { useModalsEffect } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import useAPIQuery from '@hooks/useAPIQuery'

import Header from './components/Header'
import VideoList from './components/VideoList'
import { type IYoutubeVideosStorageEntry } from './interfaces/youtube_video_storage_interfaces'
import { YoutubeVideosModals } from './modals'

function YoutubeVideos() {
  const open = useModalStore(state => state.open)
  const queryClient = useQueryClient()
  const { t } = useTranslation('apps.youtubeVideos')
  const videosQuery = useAPIQuery<IYoutubeVideosStorageEntry[]>(
    'youtube-videos/video',
    ['youtube-videos', 'video']
  )

  const [needsProgressCheck, setNeedsProgressCheck] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [filteredVideos, setFilteredVideos] = useState<
    IYoutubeVideosStorageEntry[]
  >([])

  const handleOpenAddVideosModal = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ['youtube-videos', 'video']
    })

    open('youtubeVideos/addVideo', { videos: videosQuery.data })
  }, [videosQuery.data])

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

  useModalsEffect(YoutubeVideosModals)

  return (
    <ModuleWrapper>
      <Header
        handleOpenAddVideosModal={handleOpenAddVideosModal}
        needsProgressCheck={needsProgressCheck}
        query={query}
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
                onCTAClick={handleOpenAddVideosModal}
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
      <FAB hideWhen="md" onClick={handleOpenAddVideosModal} />
    </ModuleWrapper>
  )
}

export default YoutubeVideos
