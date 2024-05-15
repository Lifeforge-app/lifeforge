/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext, useEffect } from 'react'
import EmptyStateScreen from '@components/EmptyStateScreen'
import { PhotosContext } from '@providers/PhotosProvider'
import DateGroup from './DateGroup'
import BottomBar from '../../../components/BottomBar'

function Gallery(): React.ReactElement {
  const { photos, selectedPhotos, setSelectedPhotos } =
    useContext(PhotosContext)

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  return typeof photos !== 'string' ? (
    <>
      <div className="relative flex min-h-full min-w-0 flex-col gap-8 pb-8">
        {photos.totalItems !== 0 ? (
          photos.items.map(([date, photos]) => (
            <DateGroup
              key={date}
              date={date}
              photosDimensions={photos}
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
          ))
        ) : (
          <div className="flex h-full w-full flex-1 flex-center">
            <EmptyStateScreen
              icon="tabler:photo-off"
              title="Hmm... Seems a bit empty here"
              description="You don't have any photos yet. Why not upload some?"
            />
          </div>
        )}
      </div>
      <BottomBar photos={photos} />
    </>
  ) : (
    <></>
  )
}

export default Gallery
