import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import Modal from '@components/Modals/Modal'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'
import APIRequest from '@utils/fetchData'

function AddPhotosToAlbumModal(): React.ReactElement {
  const {
    photos,
    albumList,
    selectedPhotos,
    setSelectedPhotos,
    isAddPhotosToAlbumModalOpen: isOpen,
    setAddPhotosToAlbumModalOpen: setOpen,
    refreshAlbumList: updateAlbumList,
    refreshPhotos: updatePhotos
  } = usePhotosContext()
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [loading, setLoading] = useState(false)

  function selectAlbum(id: string): void {
    setSelectedAlbum(id)
  }

  async function onSubmitButtonClick(): Promise<void> {
    if (typeof photos === 'string' || typeof albumList === 'string') {
      return
    }

    if (selectedAlbum === '') {
      return
    }

    setLoading(true)

    await APIRequest({
      endpoint: `photos/album/add-photos/${selectedAlbum}`,
      method: 'PATCH',
      body: {
        photos: selectedPhotos.filter(
          photo =>
            !(
              photos.items
                .map(p => p[1])
                .flat()
                .find(p => p.id === photo)?.is_in_album ?? false
            )
        )
      },
      successInfo: 'Yay! Photos added to album.',
      failureInfo: "Oops! Couldn't add the photos to album. Please try again.",
      callback: () => {
        setSelectedPhotos([])
        setLoading(false)
        setOpen(false)
        updateAlbumList()
        updatePhotos()
      }
    })
  }

  useEffect(() => {
    if (isOpen) {
      setSelectedAlbum('')
    }
  }, [isOpen])

  return (
    <Modal isOpen={isOpen}>
      <APIComponentWithFallback data={photos}>
        {typeof photos !== 'string' && (
          <>
            {' '}
            <div className="mb-8 flex items-center justify-between ">
              <h1 className="flex items-center gap-3 text-2xl font-semibold">
                <Icon icon="tabler:photo-plus" className="h-7 w-7" />
                Add{' '}
                {selectedPhotos
                  .filter(
                    photo =>
                      !(
                        photos.items
                          .map(p => p[1])
                          .flat()
                          .find(p => p.id === photo)?.is_in_album ?? false
                      )
                  )
                  .length.toLocaleString()}{' '}
                photos to album
              </h1>
              {!loading && (
                <button
                  onClick={() => {
                    setOpen(false)
                  }}
                  className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover: dark:hover:bg-bg-800"
                >
                  <Icon icon="tabler:x" className="h-6 w-6" />
                </button>
              )}
            </div>
            <ul className="relative w-96">
              <APIComponentWithFallback data={albumList}>
                {typeof albumList !== 'string' &&
                  albumList.map(album => (
                    <li
                      key={album.id}
                      className="relative flex items-center gap-6 font-medium text-bg-500 transition-all"
                    >
                      <button
                        onClick={() => {
                          selectAlbum(album.id)
                        }}
                        className={`flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 transition-all ${
                          selectedAlbum === album.id
                            ? 'bg-bg-300 dark:bg-bg-800'
                            : 'hover:bg-bg-200 dark:hover:bg-bg-800/50'
                        }`}
                      >
                        <div className="flex-center flex h-10 w-10 shrink-0 rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                          {album.cover ? (
                            <img
                              src={`${
                                import.meta.env.VITE_POCKETBASE_ENDPOINT
                              }/api/files/${album.cover}?thumb=0x300`}
                              alt=""
                              className="h-full w-full rounded-md object-cover"
                            />
                          ) : (
                            <Icon
                              icon="tabler:library-photo"
                              className="h-5 w-5 text-bg-500 dark:text-bg-500"
                            />
                          )}
                        </div>
                        <div className="w-full truncate text-left text-bg-500">
                          {album.name}
                        </div>
                        {selectedAlbum === album.id ? (
                          <Icon
                            icon="tabler:check"
                            className="h-6 w-6 text-bg-800 dark:!text-custom-500"
                          />
                        ) : (
                          <span className="text-sm text-bg-500">
                            {album.amount?.toLocaleString()}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
              </APIComponentWithFallback>
              {loading && (
                <div className="absolute left-0 top-0 h-full w-full"></div>
              )}
            </ul>
            <Button
              onClick={() => {
                onSubmitButtonClick().catch(console.error)
              }}
              disabled={selectedAlbum === '' || loading}
              className="mt-6"
              icon={loading ? 'svg-spinners:180-ring' : 'tabler:photo-plus'}
            >
              {!loading && 'Add to album'}
            </Button>
          </>
        )}
      </APIComponentWithFallback>
    </Modal>
  )
}

export default AddPhotosToAlbumModal
