import React from 'react'
import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'
import VideoEntry from './VideoEntry'

function VideoList({
  videos,
  setVideoToDelete,
  setIsConfirmDeleteModalOpen
}: {
  videos: IYoutubeVideosStorageEntry[]
  setVideoToDelete: (video: IYoutubeVideosStorageEntry) => void
  setIsConfirmDeleteModalOpen: (value: boolean) => void
}): React.ReactElement {
  return (
    <div className="flex-1 space-y-4 px-4 pb-8">
      {videos.map(video => (
        <VideoEntry
          key={video.id}
          setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
          setVideoToDelete={setVideoToDelete}
          video={video}
        />
      ))}
    </div>
  )
}

export default VideoList
