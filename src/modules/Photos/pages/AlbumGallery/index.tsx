/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import moment from 'moment'
import React, { useContext, useEffect } from 'react'
import Gallery from 'react-photo-gallery'
import { useNavigate, useParams } from 'react-router'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import GoBackButton from '@components/GoBackButton'
import HamburgerMenu from '@components/HamburgerMenu/index.tsx'
import MenuItem from '@components/HamburgerMenu/MenuItem.tsx'
import ModuleWrapper from '@components/ModuleWrapper'
import useFetch from '@hooks/useFetch'
import {
  type IPhotoAlbumEntryItem,
  type IPhotosAlbum
} from '@typedec/Photos.ts'
import { PhotosContext } from '../../../../providers/PhotosProvider'
import BottomBar from '../../components/BottomBar'
import ImageObject from '../../components/ImageObject'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal.tsx'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal.tsx'
import RemovePhotosFromAlbumConfirmationModal from '../../components/modals/RemovePhotosFromAlbumConfirmationModal.tsx.tsx'

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
  const [photos, refreshPhotos, setPhotos] = useFetch<IPhotoAlbumEntryItem[]>(
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
                          <div className="flex-center flex h-14 w-14 shrink-0 rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
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
              <div className="flex-center flex gap-2">
                <button className="rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-100">
                  <Icon icon="tabler:share" className="text-2xl" />
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
          <div className="relative my-6 w-full flex-1 overflow-y-auto">
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
                      refreshPhotos={refreshPhotos}
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
                      setPhotos={
                        setPhotos as React.Dispatch<
                          React.SetStateAction<IPhotoAlbumEntryItem[]>
                        >
                      }
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
        setPhotos={
          setPhotos as React.Dispatch<
            React.SetStateAction<IPhotoAlbumEntryItem[]>
          >
        }
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
