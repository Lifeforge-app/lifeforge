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
      href={`${import.meta.env.VITE_API_HOST}/youtube-videos/video/stream/${
        video.youtube_id
      }`}
      target="_blank"
      rel="noreferrer"
      className={`relative flex w-full items-center justify-between gap-8 rounded-md p-4 shadow-custom transition-all ${componentBgWithHover}`}
    >
      <div className="flex flex-col items-start md:flex-row">
        <VideoThumbnail id={video.youtube_id} duration={video.duration} />
        <VideoDetails video={video} />
      </div>
      <HamburgerMenu className="absolute right-4 top-4">
        <MenuItem
          onClick={() => {
            window.open(`https://www.youtube.com/watch?v=${video.youtube_id}`)
          }}
          text="Watch on Youtube"
          icon="tabler:brand-youtube"
        />
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
  )
}

export default VideoEntry
