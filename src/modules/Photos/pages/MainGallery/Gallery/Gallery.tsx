/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext, useEffect, useState } from 'react'
import DateGroup from './DateGroup'
import { PhotosContext } from '../../../../../providers/PhotosProvider'
import BottomBar from '../../../components/BottomBar'

function Gallery(): React.ReactElement {
  const { photos } = useContext(PhotosContext)
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  return typeof photos !== 'string' ? (
    <>
      <div className="relative flex min-h-full min-w-0 flex-col gap-8 pb-8">
        {Object.entries(photos.items).map(([date, photos]) => (
          <DateGroup
            key={date}
            date={date}
            photos={photos}
            selectedPhotos={selectedPhotos}
            setSelectedPhotos={setSelectedPhotos}
            toggleSelectAll={() => {
              if (photos.every(photo => selectedPhotos.includes(photo.id))) {
                setSelectedPhotos(
                  selectedPhotos.filter(
                    photo => !photos.map(photo => photo.id).includes(photo)
                  )
                )
                return
              }
              let _selected = selectedPhotos.slice()
              const _photos = photos.map(photo => photo.id)

              _selected = _selected.filter(photo => !_photos.includes(photo))
              _selected = [..._selected, ..._photos]
              setSelectedPhotos(_selected)
            }}
            isSelectedAll={photos.every(photo =>
              selectedPhotos.includes(photo.id)
            )}
          />
        ))}
      </div>
      <BottomBar photos={photos} />
    </>
  ) : (
    <></>
  )
}

export default Gallery
