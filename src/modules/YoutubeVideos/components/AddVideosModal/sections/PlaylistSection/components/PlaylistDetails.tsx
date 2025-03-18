import {
  type IYoutubePlaylistEntry,
  type IYoutubePlaylistVideoEntry,
  type IYoutubeVideosStorageEntry
} from '../../../../../interfaces/youtube_video_storage_interfaces'
import PlaylistInfo from './PlaylistInfo'
import PlaylistVideoEntry from './PlaylistVideoEntry'

function PlaylistDetails({
  playlistInfo,
  downloadVideo,
  downloadingVideos,
  downloadedVideos,
  videos,
  processes
}: {
  playlistInfo: IYoutubePlaylistEntry
  downloadVideo: (metadata: IYoutubePlaylistVideoEntry) => void
  downloadingVideos: React.RefObject<Set<string>>
  downloadedVideos: Set<string>
  videos: IYoutubeVideosStorageEntry[]
  processes: Record<
    string,
    {
      status: 'completed' | 'failed' | 'in_progress'
      progress: number
    }
  >
}) {
  return (
    <div className="flex flex-col space-y-2">
      <PlaylistInfo playlistInfo={playlistInfo} />
      <div className="mt-4 grid grid-cols-1 gap-4">
        {playlistInfo.entries.map(video => (
          <PlaylistVideoEntry
            key={video.id}
            downloadVideo={downloadVideo}
            progress={processes[video.id]?.progress ?? 0}
            status={(() => {
              if (
                (typeof videos !== 'string' &&
                  videos.find(v => v.youtube_id === video.id) !== undefined) ||
                downloadedVideos.has(video.id)
              ) {
                return 'completed'
              }

              if (downloadingVideos.current.has(video.id)) {
                return 'in_progress'
              }

              return processes[video.id]?.status ?? null
            })()}
            video={video}
          />
        ))}
      </div>
    </div>
  )
}

export default PlaylistDetails
