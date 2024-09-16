import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { VIDEO_RESOLUTIONS } from '@constants/video_res'
import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'
import { cleanFileSize } from '@utils/strings'

function VideoDetails({
  video
}: {
  video: IYoutubeVideosStorageEntry
}): React.ReactElement {
  return (
    <div className="mt-6 flex flex-col justify-between md:mt-0 md:pl-4 md:pr-12">
      <h3 className="text-xl font-semibold">{video.title}</h3>
      <p className="mt-6 flex flex-wrap items-center gap-2 text-bg-500">
        {video.channel !== undefined && (
          <p className="flex items-center gap-2">
            <img
              src={`${import.meta.env.VITE_API_HOST}/media/${
                video.channel.thumbnail
              }`}
              referrerPolicy="no-referrer"
              className="size-6 rounded-full"
            />
            {video.channel.name}
          </p>
        )}
        {video.upload_date !== '' && (
          <>
            <Icon icon="tabler:circle-filled" className="size-1" />
            <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
              <Icon icon="tabler:clock" className="mr-1 size-5" />
              {moment(video.upload_date).fromNow()}
            </p>
          </>
        )}

        <Icon icon="tabler:circle-filled" className="size-1" />
        <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
          <Icon icon="tabler:ruler" className="mr-1 size-5" />
          {(() => {
            const res = `${video.width}x${video.height}`

            if (Object.keys(VIDEO_RESOLUTIONS).includes(res)) {
              return VIDEO_RESOLUTIONS[res as keyof typeof VIDEO_RESOLUTIONS]
            }

            return res
          })()}
        </p>
        <Icon icon="tabler:circle-filled" className="size-1" />
        <p className="flex shrink-0 items-center gap-1 whitespace-nowrap text-bg-500">
          <Icon icon="tabler:file" className="mr-1 size-5" />
          {cleanFileSize(video.filesize)}
        </p>
      </p>
    </div>
  )
}

export default VideoDetails
