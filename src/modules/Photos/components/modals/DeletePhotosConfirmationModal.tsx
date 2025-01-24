import React, { useState } from 'react'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
import {
  type IPhotoAlbumEntryItem,
  type IPhotosEntry,
  type IPhotosEntryDimensionsAll
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
  customPhotoToBeDeleted?: IPhotosEntry | IPhotoAlbumEntryItem
  setPhotos: (
    photos: IPhotosEntryDimensionsAll | IPhotoAlbumEntryItem[]
  ) => void
}): React.ReactElement {
  const {
    selectedPhotos,
    setSelectedPhotos,
    isDeletePhotosConfirmationModalOpen,
    setDeletePhotosConfirmationModalOpen,
    refreshPhotos
  } = usePhotosContext()
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    if (!customPhotoToBeDeleted && selectedPhotos.length === 0) {
      return
    }

    setLoading(true)

    await APIRequest({
      endpoint: `photos/entries/delete?isInAlbum=${isInAlbumGallery}`,
      method: 'DELETE',
      body: {
        photos: customPhotoToBeDeleted
          ? [customPhotoToBeDeleted.id]
          : selectedPhotos
      },
      successInfo: 'delete',
      failureInfo: 'delete',
      callback: () => {
        if (customSetIsOpen) {
          customSetIsOpen(false)
        } else {
          setDeletePhotosConfirmationModalOpen(false)
        }
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
          refreshPhotos()
        }
      },
      onFailure: () => {
        if (customSetIsOpen) {
          customSetIsOpen(false)
        } else {
          setDeletePhotosConfirmationModalOpen(false)
        }
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <ModalWrapper isOpen={customIsOpen ?? isDeletePhotosConfirmationModalOpen}>
      <h1 className="text-2xl font-semibold text-bg-50">
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
            if (customSetIsOpen) {
              customSetIsOpen(false)
            } else {
              setDeletePhotosConfirmationModalOpen(false)
            }
          }}
          variant="secondary"
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
    </ModalWrapper>
  )
}

export default DeletePhotosConfirmationModal
