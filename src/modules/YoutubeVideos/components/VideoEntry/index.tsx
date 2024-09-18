import React from 'react'
import HamburgerMenu from '@components/ButtonsAndInputs/HamburgerMenu'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
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
  return (
    <a
      key={video.id}
      href={`${import.meta.env.VITE_API_HOST}/youtube-videos/video/stream/${
        video.youtube_id
      }`}
      target="_blank"
      rel="noreferrer"
      className="relative flex w-full items-center justify-between gap-8 rounded-md bg-bg-50 p-4 shadow-custom transition-all hover:bg-bg-100 dark:bg-bg-900 dark:hover:bg-bg-800/70"
    >
      <div className="flex flex-col items-start md:flex-row">
        <VideoThumbnail id={video.youtube_id} duration={video.duration} />
        <VideoDetails video={video} />
      </div>
      <HamburgerMenu
        className="absolute right-4 top-4"
        customTailwindColor="md:text-bg-500 text-bg-100"
        customWidth=""
      >
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
