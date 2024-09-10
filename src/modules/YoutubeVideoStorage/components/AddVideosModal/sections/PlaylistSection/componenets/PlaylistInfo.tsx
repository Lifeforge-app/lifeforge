import { Icon } from '@iconify/react/dist/iconify.js'
import React from 'react'
import {
  type IYoutubePlaylistVideoEntry,
  type IYoutubePlaylistEntry,
  type IYoutubeVideosStorageEntry
} from '@interfaces/youtube_video_storage_interfaces'
import { shortenBigNumber } from '@utils/strings'
import PlaylistVideoEntry from './PlaylistVideoEntry'

function PlaylistInfo({
  playlistInfo,
  downloadVideo,
  downloadingVideos,
  downloadedVideos,
  videos,
  processes
}: {
  playlistInfo: IYoutubePlaylistEntry
  downloadVideo: (metadata: IYoutubePlaylistVideoEntry) => void
  downloadingVideos: React.MutableRefObject<string[]>
  downloadedVideos: Set<string>
  videos: IYoutubeVideosStorageEntry[] | 'loading' | 'error'
  processes: Record<
    string,
    {
      status: 'completed' | 'failed' | 'in_progress'
      progress: number
    }
  >
}): React.ReactElement {
  return (
    <div className="flex flex-col space-y-2">
      <div className="mb-8 flex space-x-4">
        <img
          src={playlistInfo.thumbnail}
          alt="Playlist thumbnail"
          className="aspect-video w-56 rounded-md"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold">{playlistInfo.title}</h1>
          <p className="mt-1 font-medium text-custom-500">
            {playlistInfo.channel}
          </p>
          <p className="mt-4 flex items-center gap-2 text-bg-500">
            <Icon icon="tabler:movie" className="size-5" />
            {playlistInfo.total_videos} videos
          </p>
          <p className="flex items-center gap-2 text-bg-500">
            <Icon icon="tabler:eye" className="size-5" />
            {shortenBigNumber(playlistInfo.views)} views
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4">
        {playlistInfo.entries.map(video => (
          <PlaylistVideoEntry
            key={video.id}
            video={video}
            downloadVideo={downloadVideo}
            status={
              (typeof videos !== 'string' &&
                videos.find(v => v.youtube_id === video.id) !== undefined) ||
                downloadedVideos.has(video.id)
                ? 'completed'
                : downloadingVideos.current.includes(video.id)
                  ? 'in_progress'
                  : processes[video.id]?.status ?? null
            }
            progress={processes[video.id]?.progress ?? 0}
          />
        ))}
      </div>
    </div>
  )
}

export default PlaylistInfo
