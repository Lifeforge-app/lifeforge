import clsx from 'clsx'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import useComponentBg from '@hooks/useComponentBg'

import { type IYoutubeVideosStorageEntry } from '../../interfaces/youtube_video_storage_interfaces'
import VideoDetails from './components/VideoDetails'
import VideoThumbnail from './components/VideoThumbnail'

function VideoEntry({
  video,
  setVideoToDelete,
  setIsConfirmDeleteModalOpen
}: {
  video: IYoutubeVideosStorageEntry
  setVideoToDelete: (video: IYoutubeVideosStorageEntry) => void
  setIsConfirmDeleteModalOpen: (value: boolean) => void
}) {
  const { componentBgWithHover } = useComponentBg()

  return (
    <a
      key={video.id}
      className={clsx(
        'shadow-custom relative flex w-full items-center justify-between gap-8 rounded-md p-4 transition-all',
        componentBgWithHover
      )}
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
          onClick={() => {
            setVideoToDelete(video)
            setIsConfirmDeleteModalOpen(true)
          }}
        />
      </HamburgerMenu>
    </a>
  )
}

export default VideoEntry
