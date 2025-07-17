import { type IYoutubeVideosStorageEntry } from '../interfaces/youtube_video_storage_interfaces'
import VideoEntry from './VideoEntry'

function VideoList({ videos }: { videos: IYoutubeVideosStorageEntry[] }) {
  return (
    <div className="flex-1 space-y-4 px-4 pb-8">
      {videos.map(video => (
        <VideoEntry key={video.id} video={video} />
      ))}
    </div>
  )
}

export default VideoList
