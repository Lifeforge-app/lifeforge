import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import Gallery from 'react-photo-gallery'
import useOnScreen from '../../hooks/useOnScreen'

function DateGroup({
  date,
  photos,
  setCurrentDateInViewPort
}: {
  date: string
  photos: Array<{
    collectionId: string
    id: string
    image: string
    width: number
    height: number
  }>
  setCurrentDateInViewPort: (date: string) => void
}): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null)
  const isVisible = useOnScreen(ref)

  useEffect(() => {
    if (isVisible) {
      setCurrentDateInViewPort(date)
    }
  }, [isVisible])

  return (
    <div id={date} ref={ref} key={date} className="mt-8">
      <h2 className="mb-2 text-xl font-semibold">
        {moment(date).format('LL')}
      </h2>
      <Gallery
        photos={photos.map(image => ({
          src: `${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
            image.collectionId
          }/${image.id}/${image.image}?thumb=300x0`,
          width: image.width,
          height: image.height
        }))}
        margin={4}
      />
    </div>
  )
}

export default DateGroup
