import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useContext } from 'react'
import { PhotosContext } from '../../../providers/PhotosProvider'
import { toast } from 'react-toastify'

function BottomBar({ photos }: { photos: any }): React.ReactElement {
  const {
    selectedPhotos,
    setSelectedPhotos,
    setAddPhotosToAlbumModalOpen,
    setDeletePhotosConfirmationModalOpen
  } = useContext(PhotosContext)

  return (
    <div
      className={`absolute bottom-0 left-1/2 z-20 flex w-[calc(100%-6rem)] -translate-x-1/2 items-center justify-between rounded-t-md bg-bg-50 p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] transition-all dark:bg-bg-900 ${
        selectedPhotos.length === 0 ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            setSelectedPhotos([])
          }}
        >
          <Icon icon="tabler:x" className="h-5 w-5 text-bg-500" />
        </button>
        <p className="text-lg text-bg-500">
          {selectedPhotos.length.toLocaleString()} selected
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
          <Icon icon="tabler:share" className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            if (
              selectedPhotos.filter(
                photo =>
                  Object.values(photos.items)
                    .flat()
                    .find(p => p.id === photo)?.album === ''
              ).length === 0
            ) {
              toast.warning('All the selected photos are already in an album')
              return
            }

            setAddPhotosToAlbumModalOpen(true)
          }}
          className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30"
        >
          <Icon icon="tabler:plus" className="h-5 w-5" />
        </button>
        <button className="rounded-md p-2 text-bg-500 hover:bg-bg-200/50 hover:text-bg-500 dark:hover:bg-bg-700/30">
          <Icon icon="tabler:download" className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            setDeletePhotosConfirmationModalOpen(true)
          }}
          className="rounded-md p-2 text-red-500 hover:bg-red-200/50 hover:text-red-600"
        >
          <Icon icon="tabler:trash" className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

export default BottomBar
