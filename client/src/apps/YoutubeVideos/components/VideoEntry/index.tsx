import { useQueryClient } from '@tanstack/react-query'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import { type IYoutubeVideosStorageEntry } from '../../interfaces/youtube_video_storage_interfaces'
import VideoDetails from './components/VideoDetails'
import VideoThumbnail from './components/VideoThumbnail'

function VideoEntry({ video }: { video: IYoutubeVideosStorageEntry }) {
  const queryClient = useQueryClient()
  const open = useModalStore(state => state.open)

  const handleDeleteVideo = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'youtube-videos/video',
      customCallback: async () => {
        queryClient.setQueryData<IYoutubeVideosStorageEntry[]>(
          ['youtube-videos', 'video'],
          prevVideos => {
            if (!prevVideos) return prevVideos

            return prevVideos.filter(v => v.id !== video.id)
          }
        )
      },
      data: video,
      itemName: 'video',
      nameKey: 'title'
    })
  }, [])

  return (
    <a
      key={video.id}
      className="shadow-custom component-bg-with-hover relative flex w-full items-center justify-between gap-8 rounded-md p-4 transition-all"
      href={`${import.meta.env.VITE_API_HOST}/youtube-videos/video/stream/${
        video.youtube_id
      }`}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex flex-col items-start md:flex-row">
        <VideoThumbnail duration={video.duration} id={video.youtube_id} />
        <VideoDetails video={video} />
      </div>
      <HamburgerMenu
        classNames={{
          wrapper: 'absolute right-4 top-4'
        }}
      >
        <MenuItem
          icon="tabler:brand-youtube"
          namespace="apps.youtubeVideos"
          text="Watch on Youtube"
          onClick={() => {
            window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`)
          }}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteVideo}
        />
      </HamburgerMenu>
    </a>
  )
}

export default VideoEntry
