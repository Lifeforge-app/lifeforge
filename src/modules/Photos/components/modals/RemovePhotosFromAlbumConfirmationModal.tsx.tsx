/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import React, { useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import Modal from '@components/Modals/Modal'
import { usePhotosContext } from '@providers/PhotosProvider'
import APIRequest from '@utils/fetchData'

function RemovePhotosFromAlbumConfirmationModal({
  refreshPhotos,
  albumId
}: {
  refreshPhotos: () => void
  albumId: string
}): React.ReactElement {
  const {
    selectedPhotos,
    setSelectedPhotos,
    isRemovePhotosFromAlbumConfirmationModalOpen,
    setRemovePhotosFromAlbumConfirmationModalOpen,
    refreshAlbumList
  } = usePhotosContext()
  const [loading, setLoading] = useState(false)

  async function deleteData(): Promise<void> {
    if (selectedPhotos.length === 0) return

    setLoading(true)

    await APIRequest({
      endpoint: `photos/album/remove-photo/${albumId}`,
      method: 'DELETE',
      body: {
        photos: selectedPhotos
      },
      successInfo: 'Well, feel free to add them back whenever you want.',
      failureInfo:
        "Oops! Couldn't remove these photos from the album. Please try again.",
      callback: () => {
        setRemovePhotosFromAlbumConfirmationModalOpen(false)
        refreshAlbumList()
        refreshPhotos()
        setSelectedPhotos([])
      },
      finalCallback: () => {
        setLoading(false)
      }
    })
  }

  return (
    <Modal isOpen={isRemovePhotosFromAlbumConfirmationModalOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to remove {selectedPhotos.length} photo
        {selectedPhotos.length > 1 ? 's' : ''} from the album?
      </h1>
      <p className="mt-2 text-bg-500">
        This will remove the photos from the album but not deleting them. You
        can add them back whenever you want.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <Button
          onClick={() => {
            setRemovePhotosFromAlbumConfirmationModalOpen(false)
          }}
          type="secondary"
          icon=""
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          disabled={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
          isRed
          className="w-full"
          icon={loading ? 'svg-spinners:180-ring' : 'tabler:layout-grid-remove'}
        >
          remove
        </Button>
      </div>
    </Modal>
  )
}

export default RemovePhotosFromAlbumConfirmationModal
