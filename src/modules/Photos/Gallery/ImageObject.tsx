/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState } from 'react'
import { type IPhotosEntryItem } from '..'
import moment from 'moment'
import { LazyLoadImage } from 'react-lazy-load-image-component'

function ImageObject({
  photo,
  details,
  margin
}: {
  photo: any
  details: IPhotosEntryItem
  margin: string
}): React.ReactElement {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div
      style={{
        margin,
        height: photo.height,
        width: photo.width
      }}
      className="relative overflow-hidden bg-bg-200 dark:bg-bg-800"
      onMouseEnter={() => {
        setShowDetails(true)
      }}
      onMouseLeave={() => {
        setShowDetails(false)
      }}
    >
      <LazyLoadImage
        src={photo.src}
        className="w-full object-cover"
        delayTime={300}
        threshold={50}
        useIntersectionObserver={false}
      />
      {showDetails && (
        <div className="absolute bottom-0 left-0 flex w-full flex-col gap-1 bg-bg-800/70 p-4 text-bg-100 transition-all">
          <>
            <span className="block font-semibold">{details.name}</span>
            <span className="block text-xs">
              {moment(details.shot_time).format('LLL')}
            </span>
            <button className="mt-4 flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-custom-500 p-3 pr-4 text-sm font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800 sm:w-auto">
              DOWNLOAD
            </button>
          </>
        </div>
      )}
    </div>
  )
}

export default ImageObject
