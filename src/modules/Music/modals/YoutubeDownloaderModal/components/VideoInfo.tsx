import { Icon } from '@iconify/react/dist/iconify.js'
import moment from 'moment'
import React from 'react'
import { type YoutubeVideoInfo } from '..'
import { shortenBigNumber } from '../../../../../utils/strings'

function VideoInfo({
  videoInfo
}: {
  videoInfo: YoutubeVideoInfo
}): React.ReactElement {
  return (
    <>
      <div className="relative w-1/3 shrink-0 overflow-hidden rounded-md border border-bg-800">
        <img src={videoInfo.thumbnail} className="h-full w-full object-cover" />
        <p className="absolute bottom-2 right-2 rounded-md bg-bg-900/70 px-1.5 py-0.5 text-bg-100">
          {moment
            .utc(
              moment.duration(videoInfo.duration, 'seconds').asMilliseconds()
            )
            .format(+videoInfo.duration >= 3600 ? 'H:mm:ss' : 'm:ss')}
        </p>
      </div>
      <div>
        <h2 className="line-clamp-2 text-2xl font-medium">{videoInfo.title}</h2>
        <p className="mt-1 text-custom-500">{videoInfo.uploader}</p>
        <p className="mt-4 text-bg-500">
          {shortenBigNumber(+videoInfo.viewCount)} views •{' '}
          {moment(videoInfo.uploadDate, 'YYYYMMDD').fromNow()}
        </p>
        <p className="mt-1 flex items-center gap-1 text-bg-500">
          <Icon icon="uil:thumbs-up" /> {shortenBigNumber(+videoInfo.likeCount)}{' '}
          likes
        </p>
      </div>
    </>
  )
}

export default VideoInfo
