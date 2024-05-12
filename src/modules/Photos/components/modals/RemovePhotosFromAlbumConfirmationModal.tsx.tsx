/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@components/Button'
import Modal from '@components/Modal'
import { PhotosContext } from '@providers/PhotosProvider'

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
  } = useContext(PhotosContext)
  const [loading, setLoading] = useState(false)

  function deleteData(): void {
    if (selectedPhotos.length === 0) return

    setLoading(true)
    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/album/remove-photo/${albumId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          photos: selectedPhotos
        })
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info('Well, feel free to add them back whenever you want.')
          setRemovePhotosFromAlbumConfirmationModalOpen(false)
          refreshAlbumList()
          refreshPhotos()
          setSelectedPhotos([])
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error(
          "Oops! Couldn't remove these photos from the album. Please try again."
        )
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
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
          onClick={deleteData}
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
