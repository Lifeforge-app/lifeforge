import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'

function VideoThumbnail({
  id,
  duration
}: {
  id: string
  duration: number
}): React.ReactElement {
  return (
    <div className="relative aspect-video w-56 shrink-0 overflow-hidden rounded-md border border-bg-800 bg-bg-800/70">
      <Icon
        icon="tabler:video"
        className="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 text-bg-700"
      />
      <img
        src={`${
          import.meta.env.VITE_API_HOST
        }/youtube-video-storage/video/thumbnail/${id}`}
        alt=""
        className="relative -m-px rounded-md object-cover"
      />
      <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-bg-100">
        {moment
          .utc(moment.duration(duration, 'seconds').asMilliseconds())
          .format(duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
      </p>
    </div>
  )
}

export default VideoThumbnail