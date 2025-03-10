import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Button } from '@components/buttons'
import ModalWrapper from '@components/modals/ModalWrapper'
import { usePhotosContext } from '@providers/PhotosProvider'
import fetchAPI from '@utils/fetchAPI'

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

    try {
      await fetchAPI(`photos/album/remove-photo/${albumId}`, {
        method: 'DELETE',
        body: {
          photos: selectedPhotos
        }
      })

      setRemovePhotosFromAlbumConfirmationModalOpen(false)
      refreshAlbumList()
      refreshPhotos()
      setSelectedPhotos([])
    } catch {
      toast.error('Failed to remove photos from album')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ModalWrapper isOpen={isRemovePhotosFromAlbumConfirmationModalOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to remove {selectedPhotos.length} photo
        {selectedPhotos.length > 1 ? 's' : ''} from the album?
      </h1>
      <p className="text-bg-500 mt-2">
        This will remove the photos from the album but not deleting them. You
        can add them back whenever you want.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <Button
          className="w-full"
          icon=""
          variant="secondary"
          onClick={() => {
            setRemovePhotosFromAlbumConfirmationModalOpen(false)
          }}
        >
          Cancel
        </Button>
        <Button
          isRed
          className="w-full"
          icon="tabler:layout-grid-remove"
          loading={loading}
          onClick={() => {
            deleteData().catch(console.error)
          }}
        >
          remove
        </Button>
      </div>
    </ModalWrapper>
  )
}

export default RemovePhotosFromAlbumConfirmationModal
