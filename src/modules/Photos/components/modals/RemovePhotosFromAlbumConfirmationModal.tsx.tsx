/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { Icon } from '@iconify/react/dist/iconify.js'
import { cookieParse } from 'pocketbase'
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
        <button
          onClick={() => {
            setRemovePhotosFromAlbumConfirmationModalOpen(false)
          }}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-bg-800 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-bg-700"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          onClick={deleteData}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 transition-all hover:bg-red-600"
        >
          {loading ? (
            <>
              <span className="small-loader-light"></span>
            </>
          ) : (
            <>
              <Icon icon="tabler:layout-grid-remove" className="h-5 w-5" />
              remove
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default RemovePhotosFromAlbumConfirmationModal
