import { Icon } from '@iconify/react'
import moment from 'moment'
import React from 'react'
import { type IYoutubePlaylistVideoEntry } from '@interfaces/youtube_video_storage_interfaces'
import { shortenBigNumber } from '@utils/strings'
import IconButton from '../../../../../../Music/components/Bottombar/components/IconButton'

function ProgressOrButton({
  status,
  progress,
  video,
  downloadVideo
}: {
  status: 'completed' | 'failed' | 'in_progress' | null
  progress: number
  video: IYoutubePlaylistVideoEntry
  downloadVideo: (metadata: IYoutubePlaylistVideoEntry) => void
}): React.ReactElement {
  switch (status) {
    case 'in_progress':
      return (
        <div className="flex flex-col items-end gap-2">
          <p className="text-bg-500">{progress}%</p>
          <div className="bg-bg-500 h-1 w-24 rounded-md">
            <div
              className="bg-custom-500 h-full rounded-md transition-all"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      )
    case 'completed':
      return (
        <p className="flex items-center gap-2 text-green-500">
          <Icon className="size-5" icon="tabler:check" />
          Downloaded
        </p>
      )
    case 'failed':
      return (
        <p className="flex items-center gap-2 text-red-500">
          <Icon className="size-5" icon="tabler:alert-circle" />
          Failed
        </p>
      )
    default:
      return (
        <IconButton
          className="text-bg-500 hover:bg-bg-800/50 hover:text-bg-800 dark:hover:text-bg-50"
          icon="tabler:download"
          onClick={() => {
            downloadVideo(video)
          }}
        />
      )
  }
}

function PlaylistVideoEntry({
  video,
  downloadVideo,
  status,
  progress
}: {
  video: IYoutubePlaylistVideoEntry
  downloadVideo: (metadata: IYoutubePlaylistVideoEntry) => void
  status: 'completed' | 'failed' | 'in_progress' | null
  progress: number
}): React.ReactElement {
  return (
    <div key={video.id} className="flex items-center justify-between gap-8">
      <div className="flex space-x-2">
        <div className="border-bg-800 relative h-28 shrink-0 overflow-hidden rounded-md border">
          <img
            alt=""
            className="aspect-video size-full object-cover"
            referrerPolicy="no-referrer"
            src={video.thumbnail}
          />
          <p className="bg-bg-900/70 text-bg-50 absolute right-2 bottom-2 rounded-md px-1.5 py-0.5 text-sm">
            {moment
              .utc(moment.duration(video.duration, 'seconds').asMilliseconds())
              .format(video.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
          </p>
        </div>
        <div className="flex flex-col">
          <h1 className="line-clamp-2 text-lg font-semibold">{video.title}</h1>
          <p className="text-custom-500 font-medium">{video.uploader}</p>
          <p className="text-bg-500 mt-2">
            {shortenBigNumber(video.viewCount ?? 0)} views
          </p>
        </div>
      </div>
      <ProgressOrButton
        downloadVideo={downloadVideo}
        progress={progress}
        status={status}
        video={video}
      />
    </div>
  )
}

export default PlaylistVideoEntry
