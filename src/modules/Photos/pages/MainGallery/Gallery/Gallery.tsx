/* eslint-disable sonarjs/no-nested-functions */
import { usePhotosContext } from '@providers/PhotosProvider'
import React, { useEffect } from 'react'

import { APIFallbackComponent } from '@lifeforge/ui'
import { EmptyStateScreen } from '@lifeforge/ui'

import BottomBar from '../../../components/BottomBar'
import DateGroup from './DateGroup'

function Gallery(): React.ReactElement {
  const { photos, selectedPhotos, setSelectedPhotos } = usePhotosContext()

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  return (
    <APIFallbackComponent data={photos}>
      {photos => (
        <>
          <div className="relative flex min-h-full min-w-0 flex-col gap-8 pb-8">
            {photos.totalItems !== 0 ? (
              photos.items.map(([date, photos]) => (
                <DateGroup
                  key={date}
                  date={date}
                  isSelectedAll={photos.every(photo =>
                    selectedPhotos.includes(photo.id)
                  )}
                  photosDimensions={photos}
                  selectedPhotos={selectedPhotos}
                  setSelectedPhotos={setSelectedPhotos}
                  toggleSelectAll={() => {
                    if (
                      photos.every(photo => selectedPhotos.includes(photo.id))
                    ) {
                      setSelectedPhotos(
                        selectedPhotos.filter(
                          photo =>
                            !photos.map(photo => photo.id).includes(photo)
                        )
                      )
                      return
                    }
                    let _selected = selectedPhotos.slice()
                    const _photos = photos.map(photo => photo.id)

                    _selected = _selected.filter(
                      photo => !_photos.includes(photo)
                    )
                    _selected = [..._selected, ..._photos]
                    setSelectedPhotos(_selected)
                  }}
                />
              ))
            ) : (
              <div className="flex-center size-full flex-1">
                <EmptyStateScreen
                  icon="tabler:photo-off"
                  name="photosInAlbum"
                  namespace="modules.photos"
                />
              </div>
            )}
          </div>
          <BottomBar photos={photos as any} />
        </>
      )}
    </APIFallbackComponent>
  )
}

export default Gallery
