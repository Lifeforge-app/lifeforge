import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React, { useState } from 'react'
import PhotoAlbum from 'react-photo-album'
import { Button } from '@components/buttons'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type IPhotoAlbumEntryItem } from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'
import ImageObject from '../../components/ImageObject'
import EmptyTrashConfirmationModal from '../../components/modals/EmptyTrashConfirmationModal'
import PhotosSidebar from '../../components/PhotosSidebar'

function PhotosTrash(): React.ReactElement {
  const { selectedPhotos, setSelectedPhotos } = usePhotosContext()
  const [photos, refreshPhotos] =
    useFetch<IPhotoAlbumEntryItem[]>('photos/trash/list')
  const [
    isEmptyTrashConfirmationModalOpen,
    setIsEmptyTrashConfirmationModalOpen
  ] = useState(false)

  return (
    <ModuleWrapper>
      <ModuleHeader title="Photos" />
      <div className="relative mt-6 flex size-full min-h-0 gap-8">
        <PhotosSidebar />
        <div className="flex h-full flex-1 flex-col">
          <div className="flex-between flex">
            <h1 className="flex items-center gap-4 text-3xl font-semibold">
              <Icon icon="tabler:trash" className="size-8 shrink-0" />
              {t('sidebar.photos.trash')}
            </h1>
            <Button
              icon={'tabler:trash'}
              onClick={() => {
                setIsEmptyTrashConfirmationModalOpen(true)
              }}
              isRed
            >
              Empty trash
            </Button>
          </div>
          <div className="relative my-6 w-full flex-1 overflow-y-auto">
            <APIFallbackComponent data={photos}>
              {photos =>
                photos.length === 0 ? (
                  <EmptyStateScreen name="trash" icon="tabler:trash-off" />
                ) : (
                  <PhotoAlbum
                    layout="rows"
                    spacing={8}
                    photos={photos.map(image => ({
                      src: `${import.meta.env.VITE_API_HOST}/media/${
                        image.collectionId
                      }/${image.photoId}/${image.image}?thumb=0x300`,
                      width: image.width / 20,
                      height: image.height / 20,
                      key: image.id
                    }))}
                    renderPhoto={({
                      photo,
                      imageProps: { style, ...restImageProps }
                    }) => (
                      <ImageObject
                        // TODO
                        setImagePreviewOpenFor={() => {}}
                        beingDisplayedInAlbum
                        photo={photo}
                        style={style}
                        details={photos.find(image => image.id === photo.key)!}
                        {...restImageProps}
                        selected={
                          selectedPhotos.find(image => image === photo.key) !==
                          undefined
                        }
                        toggleSelected={(
                          e: React.MouseEvent<
                            HTMLDivElement | HTMLButtonElement
                          >
                        ) => {
                          if (photo.key !== undefined) {
                            if (
                              selectedPhotos.find(
                                image => image === photo.key
                              ) !== undefined
                            ) {
                              setSelectedPhotos(
                                selectedPhotos.filter(
                                  image => image !== photo.key
                                )
                              )
                            } else {
                              if (e.shiftKey && typeof photos !== 'string') {
                                const lastSelectedIndex = photos.findIndex(
                                  image =>
                                    image.id ===
                                    selectedPhotos[selectedPhotos.length - 1]
                                )
                                const currentIndex = photos.findIndex(
                                  image => image.id === photo.key
                                )
                                const range = photos.slice(
                                  Math.min(lastSelectedIndex, currentIndex),
                                  Math.max(lastSelectedIndex, currentIndex) + 1
                                )
                                setSelectedPhotos(
                                  Array.from(
                                    new Set([
                                      ...selectedPhotos,
                                      ...range.map(image => image.id)
                                    ])
                                  )
                                )
                              } else {
                                setSelectedPhotos([
                                  ...selectedPhotos,
                                  photo.key
                                ])
                              }
                            }
                          }
                        }}
                        selectedPhotosLength={selectedPhotos.length}
                      />
                    )}
                  />
                )
              }
            </APIFallbackComponent>
          </div>
        </div>
      </div>
      <EmptyTrashConfirmationModal
        isOpen={isEmptyTrashConfirmationModalOpen}
        setOpen={setIsEmptyTrashConfirmationModalOpen}
        refreshPhotos={refreshPhotos}
      />
    </ModuleWrapper>
  )
}

export default PhotosTrash
