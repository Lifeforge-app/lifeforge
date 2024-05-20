/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import {
  type IPhotosEntryDimensionsItem,
  type IPhotosEntryDimensionsAll,
  type IPhotoAlbumEntryItem
} from '@typedec/Photos'
import { usePhotosContext } from '../../../providers/PhotosProvider'

function BottomBar({
  photos,
  inAlbumGallery = false
}: {
  photos:
    | IPhotosEntryDimensionsAll
    | IPhotosEntryDimensionsItem[]
    | IPhotoAlbumEntryItem[]
  inAlbumGallery?: boolean
}): React.ReactElement {
  const {
    selectedPhotos,
    setSelectedPhotos,
    setAddPhotosToAlbumModalOpen,
    setDeletePhotosConfirmationModalOpen,
    setRemovePhotosFromAlbumConfirmationModalOpen,
    refreshPhotos
  } = usePhotosContext()
  const [isDownloadLoading, setIsDownloadLoading] = useState(false)

  async function requestBulkDownload(): Promise<void> {
    if (selectedPhotos.length === 0) {
      return
    }

    setIsDownloadLoading(true)

    try {
      await fetch(
        `${
          import.meta.env.VITE_API_HOST
        }/photos/entry/bulk-download?isInAlbum=${inAlbumGallery}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photos: selectedPhotos
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

          toast.success('Images are now ready for download. Head to your NAS')
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

  async function addToFavourites(): Promise<void> {
    if (selectedPhotos.length === 0) {
      return
    }

    try {
      await fetch(
        `${
          import.meta.env.VITE_API_HOST
        }/photos/favourites/add-photos?isInAlbum=${inAlbumGallery}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            photos: selectedPhotos
          })
        }
      )
        .then(async response => {
          if (response.status !== 200) {
            throw new Error('Failed to add images to favourites')
          }
          const data = await response.json()
          if (data.state !== 'success') {
            throw new Error(data.message)
          }

          toast.success('Images added to favourites')

          refreshPhotos()
        })
        .catch(error => {
          throw new Error(error as string)
        })
    } catch (error: any) {
      toast.error(`${error}`)
    }
  }

  return (
    <div
      className={`absolute bottom-0 left-1/2 z-20 flex w-[calc(100%-6rem)] -translate-x-1/2 items-center justify-between rounded-t-md bg-bg-50 p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] transition-all dark:bg-bg-900 ${
        selectedPhotos.length === 0 ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedPhotos([])
          }}
        >
          <Icon icon="tabler:x" className="h-5 w-5 text-bg-500" />
        </button>
        <p className="text-lg text-bg-500">
          {selectedPhotos.length.toLocaleString()} selected
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
          <Icon icon="tabler:share" className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            addToFavourites().catch(() => {})
          }}
          className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30"
        >
          <Icon icon="tabler:star" className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            if (inAlbumGallery) {
              setRemovePhotosFromAlbumConfirmationModalOpen(true)
            } else {
              if (
                selectedPhotos.filter(photo =>
                  Array.isArray(photos)
                    ? photos
                    : photos.items
                        .map(p => p[1])
                        .flat()
                        .find(p => p.id === photo)?.is_in_album
                ).length !== 0
              ) {
                toast.warning('All the selected photos are already in an album')
                return
              }

              setAddPhotosToAlbumModalOpen(true)
            }
          }}
          className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30"
        >
          <Icon
            icon={inAlbumGallery ? 'tabler:layout-grid-remove' : 'tabler:plus'}
            className="h-5 w-5"
          />
        </button>
        <button
          disabled={isDownloadLoading}
          onClick={() => {
            requestBulkDownload().catch(() => {})
          }}
          className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30"
        >
          <Icon
            icon={
              isDownloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'
            }
            className="h-5 w-5"
          />
        </button>
        <button
          onClick={() => {
            setDeletePhotosConfirmationModalOpen(true)
          }}
          className="rounded-md p-2 text-red-500 hover:bg-red-200/50 hover:text-red-600"
        >
          <Icon icon="tabler:trash" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default BottomBar
