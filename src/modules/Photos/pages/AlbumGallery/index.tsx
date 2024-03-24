/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import React, { useContext, useEffect } from 'react'
import ModuleWrapper from '../../../../components/general/ModuleWrapper'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useNavigate, useParams } from 'react-router'
import GoBackButton from '../../../../components/general/GoBackButton'
import useFetch from '../../../../hooks/useFetch'
import APIComponentWithFallback from '../../../../components/general/APIComponentWithFallback'
import {
  type IPhotosEntryDimensionsItem,
  type IPhotosAlbum,
  PhotosContext
} from '../../../../providers/PhotosProvider'
import Gallery from 'react-photo-gallery'
import ImageObject from '../../components/ImageObject'
import moment from 'moment'
import BottomBar from '../../components/BottomBar'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal.tsx'
import RemovePhotosFromAlbumConfirmationModal from '../../components/modals/RemovePhotosFromAlbumConfirmationModal.tsx.tsx'
import HamburgerMenu from '../../../../components/general/HamburgerMenu/index.tsx'
import MenuItem from '../../../../components/general/HamburgerMenu/MenuItem.tsx'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal.tsx'

export interface IPhotoAlbumEntryItem extends IPhotosEntryDimensionsItem {
  collectionId: string
  photoId: string
  image: string
  has_raw: boolean
  is_in_album: boolean
}

function PhotosAlbumGallery(): React.ReactElement {
  const { id } = useParams<{
    id: string
  }>()
  const { selectedPhotos, setSelectedPhotos, setModifyAlbumModalOpenType } =
    useContext(PhotosContext)
  const navigate = useNavigate()
  const [valid] = useFetch<boolean>(`photos/album/valid/${id}`)
  const [albumData, refreshAlbumData] = useFetch<IPhotosAlbum>(
    `photos/album/get/${id}`
  )
  const [photos, refreshPhotos] = useFetch<IPhotoAlbumEntryItem[]>(
    `photos/entry/list/${id}`
  )

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      navigate('/photos/album')
    }
  }, [valid])

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  return (
    <APIComponentWithFallback data={albumData}>
      <div className="relative min-h-0 w-full flex-1 overflow-y-hidden">
        <ModuleWrapper>
          <div className="flex flex-col gap-1">
            <GoBackButton
              onClick={() => {
                navigate('/photos/album')
              }}
            />
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-4 text-2xl font-semibold">
                {(() => {
                  switch (albumData) {
                    case 'loading':
                      return (
                        <>
                          <span className="small-loader-light"></span>
                          Loading...
                        </>
                      )
                    case 'error':
                      return (
                        <>
                          <Icon
                            icon="tabler:alert-triangle"
                            className="mt-0.5 h-7 w-7 text-red-500"
                          />
                          Failed to fetch data from server.
                        </>
                      )
                    default:
                      return (
                        <>
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                            {albumData.cover !== '' ? (
                              <img
                                src={`${
                                  import.meta.env.VITE_POCKETBASE_ENDPOINT
                                }/api/files/${albumData.cover}?thumb=0x300`}
                                alt=""
                                className="h-full w-full rounded-md object-cover"
                              />
                            ) : (
                              <Icon
                                icon="tabler:library-photo"
                                className="h-8 w-8 text-bg-500 dark:text-bg-500"
                              />
                            )}
                          </div>
                          <span className="flex flex-col gap-1">
                            {albumData.name}
                            {(() => {
                              switch (photos) {
                                case 'loading':
                                  return (
                                    <span className="text-sm text-bg-500">
                                      <Icon
                                        icon="svg-spinners:180-ring"
                                        className="h-5 w-5"
                                      />
                                    </span>
                                  )
                                case 'error':
                                  return (
                                    <span className="text-sm text-bg-500">
                                      Error
                                    </span>
                                  )
                                default:
                                  return (
                                    <span className="flex items-center gap-2 text-sm font-medium text-bg-500">
                                      {photos.length === 0
                                        ? 'No photos added'
                                        : photos.length === 1
                                        ? moment(photos[0].shot_time).format(
                                            'DD MMM YYYY'
                                          )
                                        : `${moment(
                                            photos[photos.length - 1].shot_time
                                          ).format('DD MMM YYYY')} ${
                                            moment(
                                              photos[photos.length - 1]
                                                .shot_time
                                            ).format('DD MMM YYYY') ===
                                            moment(photos[0].shot_time).format(
                                              'DD MMM YYYY'
                                            )
                                              ? ''
                                              : `to ${moment(
                                                  photos[0].shot_time
                                                ).format('DD MMM YYYY')}`
                                          }`}
                                      <Icon
                                        icon="tabler:circle-filled"
                                        className="h-1 w-1"
                                      />
                                      {photos.length.toLocaleString()} photos
                                    </span>
                                  )
                              }
                            })()}
                          </span>
                        </>
                      )
                  }
                })()}
              </h1>
              <div className="flex items-center justify-center gap-2">
                <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
                  <Icon icon="tabler:share" className="text-2xl" />
                </button>
                <HamburgerMenu position="relative">
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
            <APIComponentWithFallback data={photos}>
              {typeof photos !== 'string' && (
                <Gallery
                  targetRowHeight={200}
                  photos={photos.map(image => ({
                    src: `${
                      import.meta.env.VITE_POCKETBASE_ENDPOINT
                    }/api/files/${image.collectionId}/${image.photoId}/${
                      image.image
                    }?thumb=0x300`,
                    width: image.width / 20,
                    height: image.height / 20,
                    key: image.id
                  }))}
                  margin={3}
                  renderImage={({ photo, margin }) => (
                    <ImageObject
                      beingDisplayedInAlbum
                      refreshAlbumData={refreshAlbumData}
                      photo={photo}
                      details={photos.find(image => image.id === photo.key)!}
                      margin={margin ?? ''}
                      selected={
                        selectedPhotos.find(image => image === photo.key) !==
                        undefined
                      }
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
                      selectedPhotosLength={selectedPhotos.length}
                    />
                  )}
                />
              )}
            </APIComponentWithFallback>
          </div>
        </ModuleWrapper>
        <BottomBar photos={photos as IPhotoAlbumEntryItem[]} inAlbumGallery />
      </div>
      <DeletePhotosConfirmationModal
        refreshPhotos={refreshPhotos}
        isInAlbumGallery={true}
      />
      <RemovePhotosFromAlbumConfirmationModal
        albumId={(albumData as IPhotosAlbum).id}
        refreshPhotos={refreshPhotos}
      />
      <ModifyAlbumModal
        targetAlbum={albumData as IPhotosAlbum}
        refreshAlbumData={refreshAlbumData}
      />
    </APIComponentWithFallback>
  )
}

export default PhotosAlbumGallery
