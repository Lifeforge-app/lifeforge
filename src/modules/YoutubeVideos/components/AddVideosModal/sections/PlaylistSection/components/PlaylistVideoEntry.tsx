import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { type IYoutubePlaylistVideoEntry } from '@interfaces/youtube_video_storage_interfaces'
import { shortenBigNumber } from '@utils/strings'
import IconButton from '../../../../../../Music/components/Bottombar/components/IconButton'

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
        <div className="relative h-28 shrink-0 overflow-hidden rounded-md border border-bg-800">
          <img
            src={video.thumbnail}
            referrerPolicy="no-referrer"
            className="aspect-video size-full object-cover"
          />
          <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-sm text-bg-50">
            {moment
              .utc(moment.duration(video.duration, 'seconds').asMilliseconds())
              .format(video.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
          </p>
        </div>
        <div className="flex flex-col">
          <h1 className="line-clamp-2 text-lg font-semibold">{video.title}</h1>
          <p className="font-medium text-custom-500">{video.uploader}</p>
          <p className="mt-2 text-bg-500">
            {shortenBigNumber(video.viewCount ?? 0)} views
          </p>
        </div>
      </div>
      {status === 'in_progress' ? (
        <div className="flex flex-col items-end gap-2">
          <p className="text-bg-500">{progress}%</p>
          <div className="h-1 w-24 rounded-md bg-bg-500">
            <div
              className="h-full rounded-md bg-custom-500 transition-all"
              style={{
                width: `${progress}%`
              }}
            />
          </div>
        </div>
      ) : status !== null ? (
        <p
          className={`flex items-center gap-2 ${
            status === 'completed' ? 'text-green-500' : 'text-red-500'
          }`}
        >
          <Icon
            icon={
              status === 'completed' ? 'tabler:check' : 'tabler:alert-circle'
            }
            className="size-5"
          />
          {status === 'completed' ? 'Downloaded' : 'Failed'}
        </p>
      ) : (
        <IconButton
          icon="tabler:download"
          onClick={() => {
            downloadVideo(video)
          }}
          className="text-bg-500 hover:bg-bg-800/70 hover:text-bg-800 dark:hover:text-bg-50"
        />
      )}
    </div>
  )
}

export default PlaylistVideoEntry
