import clsx from 'clsx'
import React from 'react'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import useThemeColors from '@hooks/useThemeColor'
import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'
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
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()

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
      <HamburgerMenu className="absolute top-4 right-4">
        <MenuItem
          icon="tabler:brand-youtube"
          namespace="modules.youtubeVideos"
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
