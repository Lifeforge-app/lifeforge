/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modal'
import { PhotosContext } from '@providers/PhotosProvider'

function DeletePhotosConfirmationModal({
  refreshPhotos,
  isInAlbumGallery = false
}: {
  refreshPhotos: () => void
  isInAlbumGallery?: boolean
}): React.ReactElement {
  const {
    selectedPhotos,
    setSelectedPhotos,
    isDeletePhotosConfirmationModalOpen,
    setDeletePhotosConfirmationModalOpen,
    refreshAlbumList
  } = useContext(PhotosContext)
  const [loading, setLoading] = useState(false)

  function deleteData(): void {
    if (selectedPhotos.length === 0) return

    setLoading(true)
    fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/photos/entry/delete?isInAlbum=${isInAlbumGallery}`,
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
          toast.info("Uhh, hopefully you truly didn't need those photos.")
          setDeletePhotosConfirmationModalOpen(false)
          refreshAlbumList()
          refreshPhotos()
          setSelectedPhotos([])
          return data
        } else {
          throw new Error(data.message)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't delete the photos. Please try again.")
        console.error(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Modal isOpen={isDeletePhotosConfirmationModalOpen}>
      <h1 className="text-2xl font-semibold">
        Are you sure you want to delete {selectedPhotos.length} photo
        {selectedPhotos.length > 1 ? 's' : ''}?
      </h1>
      <p className="mt-2 text-bg-500">
        This will move the photos to the trash. You can restore them from there.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <button
          onClick={() => {
            setDeletePhotosConfirmationModalOpen(false)
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
              <Icon icon="tabler:trash" className="h-5 w-5" />
              DELETE
            </>
          )}
        </button>
      </div>
    </Modal>
  )
}

export default DeletePhotosConfirmationModal
