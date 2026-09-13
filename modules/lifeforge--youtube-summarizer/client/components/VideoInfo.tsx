import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import humanNumber from 'human-number'
import { Widget } from '@lifeforge/ui'

dayjs.extend(duration)
dayjs.extend(relativeTime)

import type { YoutubeInfo } from '../src/index'

function VideoInfo({ videoInfo }: { videoInfo: YoutubeInfo }) {
  return (
    <Widget
      className="h-min"
      icon="tabler:info-circle"
      namespace="apps.youtubeSummarizer"
      title="Video Info"
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="border-bg-800 relative w-full shrink-0 overflow-hidden rounded-md border md:w-64">
          <img
            alt=""
            className="size-full object-cover"
            src={videoInfo.thumbnail}
          />
          <p className="bg-bg-900/70 text-bg-50 absolute right-2 bottom-2 rounded-md px-1.5 py-0.5">
            {dayjs
              .duration(+videoInfo.duration, 'second')
              .format(+videoInfo.duration > 3600 ? 'H:mm:ss' : 'm:ss')}
          </p>
        </div>
        <div>
          <h2 className="line-clamp-2 text-2xl font-medium">
            {videoInfo.title}
          </h2>
          <p className="text-custom-500 mt-1">{videoInfo.uploader}</p>
          {videoInfo.uploadDate !== undefined && (
            <p className="text-bg-500 mt-4">
              {humanNumber(+videoInfo.viewCount)} views •{' '}
              {dayjs(videoInfo.uploadDate, 'YYYYMMDD').fromNow()}
            </p>
          )}
          {videoInfo.likeCount !== undefined && (
            <p className="text-bg-500 mt-1 flex items-center gap-1">
              <Icon icon="uil:thumbs-up" /> {humanNumber(+videoInfo.likeCount)}{' '}
              likes
            </p>
          )}
        </div>
      </div>
    </Widget>
  )
}

export default VideoInfo
