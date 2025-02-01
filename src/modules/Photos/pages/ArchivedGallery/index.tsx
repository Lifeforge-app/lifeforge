/* eslint-disable sonarjs/no-nested-functions */
/* eslint-disable sonarjs/no-nested-conditional */
import { Icon } from '@iconify/react'

import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PhotoAlbum from 'react-photo-album'
import { useNavigate, useParams } from 'react-router'
import { toast } from 'react-toastify'
import GoBackButton from '@components/buttons/GoBackButton.tsx'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem.tsx'
import HamburgerMenu from '@components/buttons/HamburgerMenu/index.tsx'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper.tsx'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback.tsx'
import Scrollbar from '@components/utilities/Scrollbar.tsx'
import useFetch from '@hooks/useFetch'
import {
  type IPhotoAlbumEntryItem,
  type IPhotosAlbum
} from '@interfaces/photos_interfaces.ts'
import { usePhotosContext } from '../../../../providers/PhotosProvider'
import BottomBar from '../../components/BottomBar'
import ImageObject from '../../components/ImageObject'
import DeletePhotosConfirmationModal from '../../components/modals/DeletePhotosConfirmationModal.tsx'
import ModifyAlbumModal from '../../components/modals/ModifyAlbumModal.tsx'
import RemovePhotosFromAlbumConfirmationModal from '../../components/modals/RemovePhotosFromAlbumConfirmationModal.tsx.tsx'
import ShareAlbumModal from '../../components/modals/ShareAlbumModal.tsx'

function PhotosAlbumGallery(): React.ReactElement {
  const { id } = useParams<{
    id: string
  }>()
  const {
    selectedPhotos,
    setSelectedPhotos,
    setModifyAlbumModalOpenType,
    setAlbumList
  } = usePhotosContext()
  const navigate = useNavigate()
  const { t } = useTranslation('modules.photos')
  const [valid] = useFetch<boolean>(`photos/album/valid/${id}`)
  const [albumData, refreshAlbumData, setAlbumData] = useFetch<IPhotosAlbum>(
    `photos/album/get/${id}`,
    valid === true
  )
  const [photos, refreshPhotos, setPhotos] = useFetch<IPhotoAlbumEntryItem[]>(
    `photos/entries/list/${id}`,
    valid === true
  )
  const [isDownloadLoading, setIsDownloadLoading] = useState(false)

  useEffect(() => {
    if (typeof valid === 'boolean' && !valid) {
      toast.error('Invalid ID')
      navigate('/photos/album')
    }
  }, [valid])

  useEffect(() => {
    return () => {
      setSelectedPhotos([])
    }
  }, [])

  async function requestBulkDownload(): Promise<void> {
    if (typeof photos === 'string') {
      return
    }

    setIsDownloadLoading(true)

    try {
      await fetch(
        `${
          import.meta.env.VITE_API_HOST
        }/photos/entries/bulk-download?isInAlbum=true`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photos: photos.map(photo => photo.id)
          })
        }
      )
        .then(async response => {
          if (response.status !== 200) {
            throw new Error('Failed to download images')
          }
          const data = await response.json()
          if (data.state !== 'success') {
            throw new Error(data.message)
          }

          toast.success(t('fetch.action.NASFilesReady'))
        })
        .catch(error => {
          throw new Error(error as string)
        })
        .finally(() => {
          setIsDownloadLoading(false)
        })
    } catch (error: any) {
      toast.error(`Failed to download images. Error: ${error}`)
    }
  }

  return (
    <APIFallbackComponent data={albumData}>
      {albumData => (
        <>
          <div className="relative min-h-0 w-full flex-1 overflow-y-hidden">
            <ModuleWrapper>
              <div className="flex w-full min-w-0 flex-col gap-1">
                <GoBackButton
                  onClick={() => {
                    navigate('/photos/album')
                  }}
                />
                <div className="flex-between flex w-full min-w-0 gap-8">
                  <h1 className="flex w-full min-w-0 items-center gap-4 text-2xl font-semibold">
                    <div className="flex-center size-14 shrink-0 rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                      {albumData.cover !== '' ? (
                        <img
                          src={`${import.meta.env.VITE_API_HOST}/media/${
                            albumData.cover
                          }?thumb=0x300`}
                          alt=""
                          className="size-full rounded-md object-cover"
                        />
                      ) : (
                        <Icon
                          icon="tabler:library-photo"
                          className="size-8 text-bg-500 dark:text-bg-500"
                        />
                      )}
                    </div>
                    <span className="flex w-full min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{albumData.name}</span>
                        <Icon
                          icon={
                            albumData.is_public ? 'tabler:world' : 'tabler:lock'
                          }
                          className="size-5 shrink-0 text-bg-500"
                        />
                      </div>
                      {(() => {
                        switch (photos) {
                          case 'loading':
                            return (
                              <span className="text-sm text-bg-500">
                                <Icon
                                  icon="svg-spinners:180-ring"
                                  className="size-5"
                                />
                              </span>
                            )
                          case 'error':
                            return (
                              <span className="text-sm text-bg-500">Error</span>
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
                                        photos[photos.length - 1].shot_time
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
                                  className="size-1"
                                />
                                {photos.length.toLocaleString()} photos
                              </span>
                            )
                        }
                      })()}
                    </span>
                  </h1>
                  <div className="flex-center gap-2">
                    <HamburgerMenu
                      largerPadding
                      className="relative"
                      customIcon="tabler:share"
                      customWidth="w-72"
                    >
                      <ShareAlbumModal
                        albumId={id as string}
                        publicity={albumData.is_public}
                        setAlbumData={setAlbumData}
                        setAlbumList={setAlbumList}
                      />
                    </HamburgerMenu>
                    <HamburgerMenu largerPadding className="relative">
                      <MenuItem
                        icon="tabler:pencil"
                        text="Rename"
                        onClick={() => {
                          setModifyAlbumModalOpenType('rename')
                        }}
                      />
                      <MenuItem
                        icon={
                          isDownloadLoading
                            ? 'svg-spinners:180-ring'
                            : 'tabler:download'
                        }
                        disabled={isDownloadLoading}
                        text="Download"
                        onClick={() => {
                          requestBulkDownload().catch(console.error)
                        }}
                      />
                    </HamburgerMenu>
                  </div>
                </div>
              </div>
              <Scrollbar className="mt-6">
                <div className="relative w-full flex-1 pb-6">
                  <APIFallbackComponent data={photos}>
                    {photos => (
                      <PhotoAlbum
                        layout="rows"
                        spacing={8}
                        photos={photos.map(image => ({
                          src: `${import.meta.env.VITE_API_HOST}/media/${
                            image.collectionId
                          }/${image.photoId}/${image.image}?thumb=0x300`,
                          width: image.width,
                          height: image.height,
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
                            details={
                              photos.find(image => image.id === photo.key)!
                            }
                            style={style}
                            {...restImageProps}
                            selected={
                              selectedPhotos.find(
                                image => image === photo.key
                              ) !== undefined
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
                                  if (
                                    e.shiftKey &&
                                    typeof photos !== 'string'
                                  ) {
                                    const lastSelectedIndex = photos.findIndex(
                                      image =>
                                        image.id ===
                                        selectedPhotos[
                                          selectedPhotos.length - 1
                                        ]
                                    )
                                    const currentIndex = photos.findIndex(
                                      image => image.id === photo.key
                                    )
                                    const range = photos.slice(
                                      Math.min(lastSelectedIndex, currentIndex),
                                      Math.max(
                                        lastSelectedIndex,
                                        currentIndex
                                      ) + 1
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
                    )}
                  </APIFallbackComponent>
                </div>
              </Scrollbar>
            </ModuleWrapper>
            <BottomBar
              photos={photos as IPhotoAlbumEntryItem[]}
              inAlbumGallery
            />
          </div>
          <DeletePhotosConfirmationModal
            setPhotos={setPhotos as any}
            isInAlbumGallery={true}
          />
          <RemovePhotosFromAlbumConfirmationModal
            albumId={albumData.id}
            refreshPhotos={refreshPhotos}
          />
          <ModifyAlbumModal
            targetAlbum={albumData}
            refreshAlbumData={refreshAlbumData}
          />
        </>
      )}
    </APIFallbackComponent>
  )
}

export default PhotosAlbumGallery
