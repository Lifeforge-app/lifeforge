/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import Modal from '@components/Modals/Modal'
import {
  type IPhotosEntryDimensionsAll,
  type IPhotoAlbumEntryItem,
  type IPhotosEntry
} from '@interfaces/photos_interfaces'
import { usePhotosContext } from '@providers/PhotosProvider'
import APIRequest from '@utils/fetchData'

function DeletePhotosConfirmationModal({
  isInAlbumGallery = false,
  customIsOpen,
  customSetIsOpen,
  customPhotoToBeDeleted,
  setPhotos
}: {
  isInAlbumGallery?: boolean
  customIsOpen?: boolean
  customSetIsOpen?: (isOpen: boolean) => void
  customPhotoToBeDeleted?: IPhotosEntry
  setPhotos:
    | React.Dispatch<React.SetStateAction<IPhotoAlbumEntryItem[]>>
    | React.Dispatch<React.SetStateAction<IPhotosEntryDimensionsAll>>
}): React.ReactElement {
  const {
    selectedPhotos,
    setSelectedPhotos,
    isDeletePhotosConfirmationModalOpen,
    setDeletePhotosConfirmationModalOpen
  } = usePhotosContext()
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    if (!customPhotoToBeDeleted && selectedPhotos.length === 0) {
      return
    }

    setLoading(true)

    await APIRequest({
      endpoint: `photos/entry/delete?isInAlbum=${isInAlbumGallery}`,
      method: 'DELETE',
      body: {
        photos: customPhotoToBeDeleted
          ? [customPhotoToBeDeleted.id]
          : selectedPhotos
      },
      successInfo: 'delete',
      failureInfo: 'delete',
      callback: () => {
        setDeletePhotosConfirmationModalOpen(false)
        setSelectedPhotos([])

        if (isInAlbumGallery) {
          if (customPhotoToBeDeleted) {
            // @ts-expect-error Lazy to fix for now ;-;
            setPhotos(prevPhotos =>
              // @ts-expect-error Lazy to fix for now ;-;
              prevPhotos.filter(photo => photo.id !== customPhotoToBeDeleted.id)
            )
          } else {
            // @ts-expect-error Lazy to fix for now ;-;
            setPhotos(prevPhotos =>
              // @ts-expect-error Lazy to fix for now ;-;
              prevPhotos.filter(photo => !selectedPhotos.includes(photo.id))
            )
          }
        } else {
          // @ts-expect-error Lazy to fix for now ;-;
          setPhotos(prevPhotos => ({
            ...prevPhotos,
            // @ts-expect-error Lazy to fix for now ;-;
            items: prevPhotos.items.map(([date, photos]) => [
              date,
              // @ts-expect-error Lazy to fix for now ;-;
              photos.filter(photo =>
                customPhotoToBeDeleted
                  ? photo.id !== customPhotoToBeDeleted.id
                  : !selectedPhotos.includes(photo.id)
              )
            ])
          }))
        }
      },
      onFailure: () => {
        setDeletePhotosConfirmationModalOpen(false)
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <Modal isOpen={customIsOpen ?? isDeletePhotosConfirmationModalOpen}>
      <h1 className="text-2xl font-semibold text-bg-100">
        Are you sure you want to delete{' '}
        {customPhotoToBeDeleted
          ? 'this photo'
          : `${selectedPhotos.length} photo`}
        {selectedPhotos.length > 1 ? 's' : ''}?
      </h1>
      <p className="mt-2 text-bg-500">
        This will move the photos to the trash. You can restore them from there.
      </p>
      <div className="mt-6 flex w-full flex-col-reverse justify-around gap-2 sm:flex-row">
        <Button
          onClick={() => {
            customSetIsOpen
              ? customSetIsOpen(false)
              : setDeletePhotosConfirmationModalOpen(false)
          }}
          type="secondary"
          icon=""
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          loading={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
          icon="tabler:trash"
          className="w-full"
          isRed
        >
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default DeletePhotosConfirmationModal
