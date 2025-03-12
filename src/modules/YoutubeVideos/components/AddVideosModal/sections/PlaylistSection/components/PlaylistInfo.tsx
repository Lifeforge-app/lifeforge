import { Icon } from '@iconify/react'
import humanNumber from 'human-number'
import React from 'react'

import { type IYoutubePlaylistEntry } from '../../../../../interfaces/youtube_video_storage_interfaces'

function PlaylistInfo({
  playlistInfo
}: {
  playlistInfo: IYoutubePlaylistEntry
}): React.ReactElement {
  return (
    <div className="mb-8 flex space-x-4">
      <img
        alt="Playlist thumbnail"
        className="aspect-video w-56 rounded-md"
        src={playlistInfo.thumbnail}
      />
      <div className="flex flex-col">
        <h1 className="text-xl font-semibold">{playlistInfo.title}</h1>
        <p className="text-custom-500 mt-1 font-medium">
          {playlistInfo.channel}
        </p>
        <p className="text-bg-500 mt-4 flex items-center gap-2">
          <Icon className="size-5" icon="tabler:movie" />
          {playlistInfo.total_videos} videos
        </p>
        <p className="text-bg-500 flex items-center gap-2">
          <Icon className="size-5" icon="tabler:eye" />
          {humanNumber(playlistInfo.views)} views
        </p>
      </div>
    </div>
  )
}

export default PlaylistInfo
