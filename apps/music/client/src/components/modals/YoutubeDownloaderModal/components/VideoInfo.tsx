import { Icon } from '@iconify/react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import humanNumber from 'human-number'

dayjs.extend(duration)
dayjs.extend(relativeTime)

function VideoInfo({ videoInfo }: { videoInfo: any }) {
  return (
    <div className="component-bg-lighter shadow-custom flex w-full flex-col items-center gap-6 rounded-md p-4 md:flex-row">
      <div className="border-bg-800 relative shrink-0 overflow-hidden rounded-md border md:w-64">
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
        <h2 className="line-clamp-2 text-2xl font-medium">{videoInfo.title}</h2>
        <p className="text-custom-500 mt-1">{videoInfo.uploader}</p>
        {videoInfo.uploadDate !== undefined && (
          <p className="text-bg-500 mt-4">
            {humanNumber(+videoInfo.viewCount, n =>
              Number.parseFloat(`${n}`).toFixed(2)
            )}{' '}
            views • {dayjs(videoInfo.uploadDate, 'YYYYMMDD').fromNow()}
          </p>
        )}
        {videoInfo.likeCount !== undefined && (
          <p className="text-bg-500 mt-1 flex items-center gap-1">
            <Icon icon="uil:thumbs-up" />{' '}
            {humanNumber(+videoInfo.likeCount, n =>
              Number.parseFloat(`${n}`).toFixed(2)
            )}{' '}
            likes
          </p>
        )}
      </div>
    </div>
  )
}

export default VideoInfo
