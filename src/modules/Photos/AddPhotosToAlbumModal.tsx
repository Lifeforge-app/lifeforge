import React, { useContext } from 'react'
import Modal from '../../components/general/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import { PhotosContext } from '.'

function AddPhotosToAlbumModal(): React.ReactElement {
  const {
    isAddPhotosToAlbumModalOpen: isOpen,
    setAddPhotosToAlbumModalOpen: setOpen,
    refreshAlbumList: updateAlbumList
  } = useContext(PhotosContext)

  return (
    <Modal isOpen={isOpen}>
      <div className="mb-8 flex items-center justify-between ">
        <h1 className="flex items-center gap-3 text-2xl font-semibold">
          <Icon icon="tabler:photo-plus" className="h-7 w-7" />
          Add photos to album
        </h1>
        <button
          onClick={() => {
            setOpen(false)
          }}
          className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
        >
          <Icon icon="tabler:x" className="h-6 w-6" />
        </button>
      </div>
    </Modal>
  )
}

export default AddPhotosToAlbumModal
