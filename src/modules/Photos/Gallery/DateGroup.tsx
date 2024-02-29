/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import Gallery from 'react-photo-gallery'
import useOnScreen from '../../../hooks/useOnScreen'
import { type IPhotosEntryItem } from '..'
import ImageObject from './ImageObject'

function DateGroup({
  date,
  photos,
  timelineDateDisplayRef,
  mobileDateDisplayRef
}: {
  date: string
  photos: IPhotosEntryItem[]
  timelineDateDisplayRef: React.RefObject<HTMLDivElement>
  mobileDateDisplayRef: React.RefObject<HTMLDivElement>
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)

  useEffect(() => {
    if (isVisible) {
      if (timelineDateDisplayRef.current !== null) {
        timelineDateDisplayRef.current.innerHTML =
          moment(date).format('MMM D, YYYY')
      }
      if (mobileDateDisplayRef.current !== null) {
        mobileDateDisplayRef.current.innerHTML =
          moment(date).format('MMM D, YYYY')
      }
    }
  }, [isVisible])

  return (
    <div id={date} ref={ref} key={date}>
      <h2 className="mb-2 flex items-end gap-2 text-xl font-semibold">
        {moment(date).format('LL')}
        <span className="mb-0.5 block text-sm font-normal text-bg-500">
          ({photos.length})
        </span>
      </h2>
      <Gallery
        targetRowHeight={300}
        photos={photos.map(image => ({
          src: `${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
            image.collectionId
          }/${image.id}/${image.image}?thumb=0x300`,
          width: image.width / 20,
          height: image.height / 20,
          key: image.id
        }))}
        margin={3}
        renderImage={({ photo, margin }) => (
          <ImageObject
            photo={photo}
            details={photos.find(image => image.id === photo.key)!}
            margin={margin ?? ''}
          />
        )}
      />
    </div>
  )
}

export default DateGroup
