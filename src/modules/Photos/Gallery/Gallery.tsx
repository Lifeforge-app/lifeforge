/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import DateGroup from './DateGroup'
import { type IPhotosEntry } from '..'

function Gallery({
  photos,
  timelineDateDisplayRef,
  mobileDateDisplayRef
}: {
  photos: IPhotosEntry
  timelineDateDisplayRef: React.RefObject<HTMLDivElement>
  mobileDateDisplayRef: React.RefObject<HTMLDivElement>
}): React.ReactElement {
  return (
    <div id="gallery-container" className="flex w-full flex-col gap-8">
      {Object.entries(photos.items).map(([date, photos]) => (
        <DateGroup
          key={date}
          date={date}
          photos={photos}
          timelineDateDisplayRef={timelineDateDisplayRef}
          mobileDateDisplayRef={mobileDateDisplayRef}
        />
      ))}
    </div>
  )
}

export default Gallery
