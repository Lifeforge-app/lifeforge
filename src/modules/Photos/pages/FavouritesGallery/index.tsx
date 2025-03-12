/* eslint-disable sonarjs/no-nested-functions */
import { Icon } from '@iconify/react'
import React, { useEffect } from 'react'
import PhotoAlbum from 'react-photo-album'
import { useNavigate } from 'react-router'

import {
  APIFallbackComponent,
  GoBackButton,
  HamburgerMenu,
  MenuItem,
  ModuleWrapper
} from '@lifeforge/ui'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

import useFetch from '@hooks/useFetch.ts'

import BottomBar from '../../components/BottomBar.tsx'
import ImageObject from '../../components/ImageObject.tsx'
import { type IPhotoAlbumEntryItem } from '../../interfaces/photos_interfaces.ts'

function PhotosFavouritesGallery(): React.ReactElement {
  const { selectedPhotos, setSelectedPhotos, setModifyAlbumModalOpenType } =
    usePhotosContext()
  const navigate = useNavigate()
  const [photos] = useFetch<IPhotoAlbumEntryItem[]>('photos/favourites/list')

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  return (
    <>
      <div className="relative min-h-0 w-full flex-1 overflow-y-hidden">
        <ModuleWrapper>
          <div className="space-y-1">
            <GoBackButton
              onClick={() => {
                navigate('/photos')
              }}
            />
            <div className="flex-between flex">
              <h1 className="flex items-center gap-4 text-2xl font-semibold">
                <>
                  <div className="flex-center bg-bg-200 dark:bg-bg-700/50 size-14 shrink-0 rounded-md shadow-md">
                    <Icon className="size-7" icon="tabler:star-filled" />
                  </div>
                  <span className="space-y-1">
                    Favourites
                    {(() => {
                      switch (photos) {
                        case 'loading':
                          return (
                            <span className="text-bg-500 text-sm">
                              <Icon
                                className="size-5"
                                icon="svg-spinners:180-ring"
                              />
                            </span>
                          )
                        case 'error':
                          return (
                            <span className="text-bg-500 text-sm">Error</span>
                          )
                        default:
                          return (
                            <span className="text-bg-500 flex items-center gap-2 text-sm font-medium">
                              {photos.length.toLocaleString()} photos
                            </span>
                          )
                      }
                    })()}
                  </span>
                </>
              </h1>
              <div className="flex-center gap-2">
                <button className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50 rounded-lg p-4 transition-all">
                  <Icon className="text-2xl" icon="tabler:share" />
                </button>
                <HamburgerMenu largerPadding className="relative">
                  <MenuItem
                    icon="tabler:pencil"
                    text="Rename"
                    onClick={() => {
                      setModifyAlbumModalOpenType('rename')
                    }}
                  />
                </HamburgerMenu>
              </div>
            </div>
          </div>
          <div className="relative my-6 w-full flex-1">
            <APIFallbackComponent data={photos}>
              {photos => (
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
                        e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
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
                              setSelectedPhotos([...selectedPhotos, photo.key])
                            }
                          }
                        }
                      }}
                    />
                  )}
                  spacing={8}
                />
              )}
            </APIFallbackComponent>
          </div>
        </ModuleWrapper>
        <BottomBar inAlbumGallery photos={photos as IPhotoAlbumEntryItem[]} />
      </div>
    </>
  )
}

export default PhotosFavouritesGallery
