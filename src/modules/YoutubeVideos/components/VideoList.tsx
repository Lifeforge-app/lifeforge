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
    <div className="mb-16 flex-1 space-y-4">
      {videos.map(video => (
        <VideoEntry
          key={video.id}
          video={video}
          setVideoToDelete={setVideoToDelete}
          setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
        />
      ))}
    </div>
  )
}

export default VideoList
