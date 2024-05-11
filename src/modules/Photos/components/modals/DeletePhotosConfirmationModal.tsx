/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react'
import { cookieParse } from 'pocketbase'
import React, { useContext, useState } from 'react'
import { toast } from 'react-toastify'
import Modal from '@components/Modal'
import { PhotosContext } from '@providers/PhotosProvider'
import {
  type IPhotosEntryDimensionsAll,
  type IPhotoAlbumEntryItem,
  type IPhotosEntry
} from '@typedec/Photos'

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
    setDeletePhotosConfirmationModalOpen,
    refreshAlbumList
  } = useContext(PhotosContext)
  const [loading, setLoading] = useState(false)

  function deleteData(): void {
    if (!customPhotoToBeDeleted && selectedPhotos.length === 0) {
      return
    }

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
          photos: customPhotoToBeDeleted
            ? [customPhotoToBeDeleted.id]
            : selectedPhotos
        })
      }
    )
      .then(async res => {
        const data = await res.json()
        if (res.ok) {
          toast.info("Uhh, hopefully you truly didn't need those photos.")
          setDeletePhotosConfirmationModalOpen(false)
          setSelectedPhotos([])

          if (isInAlbumGallery) {
            if (customPhotoToBeDeleted) {
              setPhotos(prevPhotos =>
                prevPhotos.filter(
                  photo => photo.id !== customPhotoToBeDeleted.id
                )
              )
            } else {
              setPhotos(prevPhotos =>
                prevPhotos.filter(photo => !selectedPhotos.includes(photo.id))
              )
            }
          } else {
            setPhotos(prevPhotos => ({
              ...prevPhotos,
              items: prevPhotos.items.map(([date, photos]) => [
                date,
                photos.filter(photo =>
                  customPhotoToBeDeleted
                    ? photo.id !== customPhotoToBeDeleted.id
                    : !selectedPhotos.includes(photo.id)
                )
              ])
            }))
          }

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
    <Modal isOpen={customIsOpen ?? isDeletePhotosConfirmationModalOpen}>
      <h1 className="text-2xl font-semibold text-bg-100">
        Are you sure you want to delete{' '}
        {customPhotoToBeDeleted
          ? 'this photo'
          : `${selectedPhotos.length} photos`}{' '}
        {selectedPhotos.length > 1 ? 's' : ''}?
      </h1>
      <p className="mt-2 text-bg-500">
        This will move the photos to the trash. You can restore them from there.
      </p>
      <div className="mt-6 flex w-full justify-around gap-2">
        <button
          onClick={() => {
            customSetIsOpen
              ? customSetIsOpen(false)
              : setDeletePhotosConfirmationModalOpen(false)
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
