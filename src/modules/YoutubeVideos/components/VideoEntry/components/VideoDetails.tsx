import { VIDEO_RESOLUTIONS } from '@constants/video_res'
import { Icon } from '@iconify/react'
import { cleanFileSize } from '@utils/strings'
import moment from 'moment'
import React from 'react'

import { type IYoutubeVideosStorageEntry } from '@interfaces/youtube_video_storage_interfaces'

function VideoDetails({
  video
}: {
  video: IYoutubeVideosStorageEntry
}): React.ReactElement {
  return (
    <div className="mt-6 flex flex-col justify-between md:mt-0 md:pl-4 md:pr-12">
      <h3 className="text-xl font-semibold">{video.title}</h3>
      <div className="text-bg-500 mt-6 flex flex-wrap items-center gap-2">
        {video.channel !== undefined && (
          <p className="flex items-center gap-2">
            <img
              alt=""
              className="size-6 rounded-full"
              referrerPolicy="no-referrer"
              src={`${import.meta.env.VITE_API_HOST}/media/${
                video.channel.thumbnail
              }`}
            />
            {video.channel.name}
          </p>
        )}
        {video.upload_date !== '' && (
          <>
            <Icon className="size-1" icon="tabler:circle-filled" />
            <p className="text-bg-500 flex shrink-0 items-center gap-1 whitespace-nowrap">
              <Icon className="mr-1 size-5" icon="tabler:clock" />
              {moment(video.upload_date).fromNow()}
            </p>
          </>
        )}

        <Icon className="size-1" icon="tabler:circle-filled" />
        <p className="text-bg-500 flex shrink-0 items-center gap-1 whitespace-nowrap">
          <Icon className="mr-1 size-5" icon="tabler:ruler" />
          {(() => {
            const res = `${video.width}x${video.height}`

            if (Object.keys(VIDEO_RESOLUTIONS).includes(res)) {
              return VIDEO_RESOLUTIONS[res as keyof typeof VIDEO_RESOLUTIONS]
            }

            return res
          })()}
        </p>
        <Icon className="size-1" icon="tabler:circle-filled" />
        <p className="text-bg-500 flex shrink-0 items-center gap-1 whitespace-nowrap">
          <Icon className="mr-1 size-5" icon="tabler:file" />
          {cleanFileSize(video.filesize)}
        </p>
      </div>
    </div>
  )
}

export default VideoDetails
