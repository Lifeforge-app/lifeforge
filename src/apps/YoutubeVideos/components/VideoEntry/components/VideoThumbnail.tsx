import { Icon } from '@iconify/react'
import dayjs from 'dayjs'

function VideoThumbnail({ id, duration }: { id: string; duration: number }) {
  return (
    <div className="border-bg-300 bg-bg-200 dark:border-bg-800 dark:bg-bg-800/50 relative aspect-video w-full shrink-0 overflow-hidden rounded-md border md:w-56">
      <Icon
        className="text-bg-300 dark:text-bg-700 absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2"
        icon="tabler:video"
      />
      <img
        alt=""
        className="relative object-cover"
        src={`${
          import.meta.env.VITE_API_HOST
        }/youtube-videos/video/thumbnail/${id}`}
      />
      <p className="bg-bg-900/70 text-bg-50 absolute bottom-2 right-2 rounded-md px-1.5 py-0.5">
        {dayjs
          .duration(duration, 'second')
          .format(duration > 3600 ? 'h:mm:ss' : 'm:ss')}
      </p>
    </div>
  )
}

export default VideoThumbnail
