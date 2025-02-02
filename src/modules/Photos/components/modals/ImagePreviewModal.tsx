import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import HamburgerMenu from '@components/buttons/HamburgerMenu'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import useFetch from '@hooks/useFetch'
import {
  type IPhotoAlbumEntryItem,
  type IPhotosEntry,
  type IPhotosEntryDimensionsAll
} from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'
import forceDown from '@utils/forceDown'
import DeletePhotosConfirmationModal from './DeletePhotosConfirmationModal'

function ImagePreviewModal({
  isOpen,
  onClose,
  data,
  beingDisplayedInAlbum = false,
  refreshAlbumData,
  refreshPhotos,
  setPhotos,
  onNextPhoto,
  onPreviousPhoto
}: {
  isOpen: boolean
  onClose: () => void
  data: IPhotosEntry | IPhotoAlbumEntryItem | null
  beingDisplayedInAlbum?: boolean
  refreshAlbumData?: () => void
  setPhotos?:
    | React.Dispatch<React.SetStateAction<IPhotosEntryDimensionsAll>>
    | React.Dispatch<React.SetStateAction<IPhotoAlbumEntryItem[]>>
  refreshPhotos: () => void
  onNextPhoto?: () => void
  onPreviousPhoto?: () => void
}): React.ReactElement {
  const { refreshAlbumList } = usePhotosContext()
  const { id: albumId } = useParams<{ id: string }>()
  const [name] = useFetch<string>(
    `photos/entries/name/${data?.id}?isInAlbum=${beingDisplayedInAlbum}`,
    isOpen && data !== null
  )
  const [deleteConfirmationModalOpen, setDeletePhotosConfirmationModalOpen] =
    useState(false)

  async function requestDownload(isRaw: boolean): Promise<void> {
    if (data === null) {
      return
    }

    try {
      const { url, fileName } = await fetch(
        `${import.meta.env.VITE_API_HOST}/photos/entries/download/${
          data.id
        }?raw=${isRaw}&isInAlbum=${beingDisplayedInAlbum}`,
        {
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          }
        }
      )
        .then(async response => {
          if (response.status !== 200) {
            throw new Error('Failed to get download link.')
          }
          return await response.json()
        })
        .then(data => {
          return data.data
        })
        .catch(error => {
          throw new Error(error as string)
        })

      forceDown(url, fileName).catch(console.error)
    } catch (error: any) {
      toast.error(`Failed to get download link. Error: ${error}`)
    }
  }

  function setAsCover(): void {
    if (data === null) {
      return
    }

    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/album/set-cover/${albumId}/${
        data.id
      }?isInAlbum=${beingDisplayedInAlbum}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        try {
          const data = await response.json()

          if (response.status !== 200 || data.state !== 'success') {
            throw data.message
          }
          toast.info('Thumbnail has been set.')
          refreshAlbumList()
          if (refreshAlbumData !== undefined) {
            refreshAlbumData()
          }
          refreshPhotos()
        } catch (error) {
          throw new Error(error as string)
        }
      })
      .catch(error => {
        toast.error('Failed to set thumbnail. Error: ' + error)
      })
  }

  return (
    <>
      <ModalWrapper
        className="h-full"
        isOpen={isOpen}
        minHeight="90vh"
        minWidth="90%"
      >
        <ModalHeader icon="uil:image" title="Image Preview" onClose={onClose} />
        {isOpen && data !== null && (
          <>
            <header className="flex-between mb-6 flex w-full gap-2">
              {(() => {
                switch (name) {
                  case 'loading':
                    return (
                      <div className="animate-pulse text-lg text-bg-50">
                        Loading...
                      </div>
                    )
                  case 'error':
                    return (
                      <div className="flex items-center gap-2 text-lg text-red-500">
                        <Icon className="size-5" icon="tabler:alert-triangle" />
                        Failed to load image name
                      </div>
                    )
                  default:
                    return <div className="text-lg text-bg-50">{name}</div>
                }
              })()}
              <div className="flex items-center gap-4">
                <HamburgerMenu
                  lighter
                  className="relative"
                  customIcon="tabler:download"
                  customWidth="w-56"
                >
                  {data.has_raw && (
                    <MenuItem
                      icon="tabler:download"
                      text="Download RAW"
                      onClick={() => {
                        requestDownload(true).catch(console.error)
                      }}
                    />
                  )}
                  <MenuItem
                    icon="tabler:download"
                    text="Download JPEG"
                    onClick={() => {
                      requestDownload(false).catch(console.error)
                    }}
                  />
                </HamburgerMenu>
                <Button
                  isRed
                  className="p-2!"
                  icon="tabler:trash"
                  variant="no-bg"
                  onClick={() => {
                    setDeletePhotosConfirmationModalOpen(true)
                  }}
                />
                <HamburgerMenu lighter className="relative" customWidth="w-56">
                  {beingDisplayedInAlbum && (
                    <MenuItem
                      icon="tabler:album"
                      text="Set as album cover"
                      onClick={setAsCover}
                    />
                  )}
                </HamburgerMenu>
              </div>
            </header>
            <div className="flex-between flex h-full flex-1 overflow-y-hidden">
              {onPreviousPhoto !== undefined && (
                <Button
                  className="h-full"
                  icon="tabler:chevron-left"
                  variant="no-bg"
                  onClick={onPreviousPhoto}
                />
              )}
              <div className="flex-center size-full min-h-0 min-w-0">
                <img
                  key={data.id}
                  alt=""
                  className="h-full object-contain"
                  src={`${import.meta.env.VITE_API_HOST}/media/${
                    data.collectionId
                  }/${
                    Object.keys(data).includes('photoId')
                      ? (data as IPhotoAlbumEntryItem).photoId
                      : data.id
                  }/${data.image}`}
                />
              </div>
              {onNextPhoto !== undefined && (
                <Button
                  className="h-full"
                  icon="tabler:chevron-right"
                  variant="no-bg"
                  onClick={onNextPhoto}
                />
              )}
            </div>
          </>
        )}
      </ModalWrapper>
      <DeletePhotosConfirmationModal
        customIsOpen={deleteConfirmationModalOpen}
        customPhotoToBeDeleted={data ?? undefined}
        customSetIsOpen={setDeletePhotosConfirmationModalOpen}
        isInAlbumGallery={beingDisplayedInAlbum}
        setPhotos={(photos: any) => {
          if (setPhotos !== undefined) {
            setPhotos(photos)
          } else {
            refreshPhotos()
          }
          refreshAlbumData?.()
          if (onNextPhoto !== undefined) {
            onNextPhoto()
          } else {
            onClose()
          }
        }}
      />
    </>
  )
}

export default ImagePreviewModal
