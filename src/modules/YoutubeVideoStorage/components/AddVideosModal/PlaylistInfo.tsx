import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { type IYoutubePlaylistEntry } from '@interfaces/youtube_video_storage_interfaces'
import { shortenBigNumber } from '@utils/strings'

function PlaylistInfo({
  playlistInfo
}: {
  playlistInfo: IYoutubePlaylistEntry
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
          <div key={video.id} className="flex space-x-2">
            <div className="relative h-28 shrink-0 overflow-hidden rounded-md border border-bg-800">
              <img
                src={video.thumbnail}
                className="aspect-video size-full object-cover"
              />
              <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-sm text-bg-100">
                {moment
                  .utc(
                    moment.duration(video.duration, 'seconds').asMilliseconds()
                  )
                  .format(video.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
              </p>
            </div>
            <div className="flex flex-col">
              <h1 className="line-clamp-2 text-lg font-semibold">
                {video.title}
              </h1>
              <p className="font-medium text-custom-500">{video.uploader}</p>
              <p className="mt-2 text-bg-500">
                {shortenBigNumber(video.viewCount ?? 0)} views
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaylistInfo
