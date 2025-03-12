/* eslint-disable sonarjs/no-nested-functions */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhotoAlbum from 'react-photo-album'

import {
  APIFallbackComponent,
  Button,
  EmptyStateScreen,
  ModuleHeader,
  ModuleWrapper
} from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

import useFetch from '@hooks/useFetch'

import ImageObject from '../../components/ImageObject'
import PhotosSidebar from '../../components/PhotosSidebar'
import EmptyTrashConfirmationModal from '../../components/modals/EmptyTrashConfirmationModal'
import { type IPhotoAlbumEntryItem } from '../../interfaces/photos_interfaces'

function PhotosTrash(): React.ReactElement {
  const { t } = useTranslation('modules.photos')
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
              <Icon className="size-8 shrink-0" icon="tabler:trash" />
              {t('sidebar.photos.trash')}
            </h1>
            <Button
              isRed
              icon={'tabler:trash'}
              onClick={() => {
                setIsEmptyTrashConfirmationModalOpen(true)
              }}
            >
              Empty trash
            </Button>
          </div>
          <div className="relative my-6 w-full flex-1 overflow-y-auto">
            <APIFallbackComponent data={photos}>
              {photos =>
                photos.length === 0 ? (
                  <EmptyStateScreen
                    icon="tabler:trash-off"
                    name="trash"
                    namespace="modules.photos"
                  />
                ) : (
                  <PhotoAlbum
                    layout="rows"
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
                        beingDisplayedInAlbum
                        details={photos.find(image => image.id === photo.key)!}
                        photo={photo}
                        setImagePreviewOpenFor={() => {}}
                        style={style}
                        {...restImageProps}
                        selected={
                          selectedPhotos.find(image => image === photo.key) !==
                          undefined
                        }
                        selectedPhotosLength={selectedPhotos.length}
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
                      />
                    )}
                    spacing={8}
                  />
                )
              }
            </APIFallbackComponent>
          </div>
        </div>
      </div>
      <EmptyTrashConfirmationModal
        isOpen={isEmptyTrashConfirmationModalOpen}
        refreshPhotos={refreshPhotos}
        setOpen={setIsEmptyTrashConfirmationModalOpen}
      />
    </ModuleWrapper>
  )
}

export default PhotosTrash
