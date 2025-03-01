import { Icon } from '@iconify/react'

import clsx from 'clsx'
import { cookieParse } from 'pocketbase'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import {
  type IPhotoAlbumEntryItem,
  type IPhotosEntryDimensionsAll,
  type IPhotosEntryDimensionsItem
} from '@interfaces/photos_interfaces'
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
  const { t } = useTranslation('modules.photos')
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
        }/photos/entries/bulk-download?isInAlbum=${inAlbumGallery}`,
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
      className={clsx(
        'flex-between absolute bottom-0 left-1/2 z-20 flex w-[calc(100%-6rem)] -translate-x-1/2 rounded-t-md bg-bg-50 p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] transition-all dark:bg-bg-900',
        selectedPhotos.length === 0 ? 'translate-y-full' : 'translate-y-0'
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedPhotos([])
          }}
        >
          <Icon className="size-5 text-bg-500" icon="tabler:x" />
        </button>
        <p className="text-lg text-bg-500">
          {selectedPhotos.length.toLocaleString()} selected
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-md p-2 text-bg-500 hover:bg-bg-100 hover:text-bg-500 dark:hover:bg-bg-700/30">
          <Icon className="size-5" icon="tabler:share" />
        </button>
        <button
          className="rounded-md p-2 text-bg-500 hover:bg-bg-100 hover:text-bg-500 dark:hover:bg-bg-700/30"
          onClick={() => {
            addToFavourites().catch(() => {})
          }}
        >
          <Icon className="size-5" icon="tabler:star" />
        </button>
        <button
          className="rounded-md p-2 text-bg-500 hover:bg-bg-100 hover:text-bg-500 dark:hover:bg-bg-700/30"
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
        >
          <Icon
            className="size-5"
            icon={inAlbumGallery ? 'tabler:layout-grid-remove' : 'tabler:plus'}
          />
        </button>
        <button
          className="rounded-md p-2 text-bg-500 hover:bg-bg-100 hover:text-bg-500 dark:hover:bg-bg-700/30"
          disabled={isDownloadLoading}
          onClick={() => {
            requestBulkDownload().catch(() => {})
          }}
        >
          <Icon
            className="size-5"
            icon={
              isDownloadLoading ? 'svg-spinners:180-ring' : 'tabler:download'
            }
          />
        </button>
        <button
          className="rounded-md p-2 text-red-500 hover:bg-red-200/50 hover:text-red-600"
          onClick={() => {
            setDeletePhotosConfirmationModalOpen(true)
          }}
        >
          <Icon className="size-5" icon="tabler:trash" />
        </button>
      </div>
    </div>
  )
}

export default BottomBar
