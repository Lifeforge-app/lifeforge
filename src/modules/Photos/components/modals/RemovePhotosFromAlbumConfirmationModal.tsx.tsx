import React, { useState } from 'react'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
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
      successInfo: 'remove',
      failureInfo: 'remove',
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
    <ModalWrapper isOpen={isRemovePhotosFromAlbumConfirmationModalOpen}>
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
          isRed
          className="w-full"
          icon="tabler:layout-grid-remove"
        >
          remove
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default RemovePhotosFromAlbumConfirmationModal
