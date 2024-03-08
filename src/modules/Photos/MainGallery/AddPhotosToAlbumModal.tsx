/* eslint-disable multiline-ternary */
import React, { useContext, useEffect, useState } from 'react'
import Modal from '../../../components/general/Modal'
import { Icon } from '@iconify/react/dist/iconify.js'
import { PhotosContext } from '..'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import { cookieParse } from 'pocketbase'
import { toast } from 'react-toastify'

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
  } = useContext(PhotosContext)
  const [selectedAlbum, setSelectedAlbum] = useState('')
  const [loading, setLoading] = useState(false)

  function selectAlbum(id: string): void {
    setSelectedAlbum(id)
  }

  function onSubmitButtonClick(): void {
    if (typeof photos === 'string' || typeof albumList === 'string') {
      return
    }

    if (selectedAlbum === '') {
      return
    }

    setLoading(true)

    fetch(
      `${
        import.meta.env.VITE_API_HOST
      }/photos/album/add-photo/${selectedAlbum}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        },
        body: JSON.stringify({
          photos: selectedPhotos.filter(
            photo =>
              Object.values(photos.items)
                .flat()
                .find(p => p.id === photo)?.album === ''
          )
        })
      }
    )
      .then(async res => {
        const data = await res.json()
        if (!res.ok) {
          throw data.message
        }
        setSelectedPhotos([])
        setLoading(false)
        setOpen(false)
        updateAlbumList()
        updatePhotos()
        toast.success('Yay! Photos added to album.')
      })
      .catch(err => {
        console.error(err)
        toast.error("Oops! Couldn't add the photos to album. Please try again.")
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
                      Object.values(photos.items)
                        .flat()
                        .find(p => p.id === photo)?.album === ''
                  )
                  .length.toLocaleString()}{' '}
                photos to album
              </h1>
              {!loading && (
                <button
                  onClick={() => {
                    setOpen(false)
                  }}
                  className="rounded-md p-2 text-bg-500 transition-all hover:bg-bg-200/50 hover:text-bg-800 dark:text-bg-100 dark:hover:bg-bg-800"
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
                      className="relative flex items-center gap-6 font-medium text-bg-400 transition-all"
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
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                          <Icon
                            icon="tabler:library-photo"
                            className="h-5 w-5 text-bg-400 dark:text-bg-500"
                          />
                        </div>
                        <div className="w-full text-left text-bg-500 ">
                          {album.name}
                        </div>
                        {selectedAlbum === album.id ? (
                          <Icon
                            icon="tabler:check"
                            className="h-6 w-6 text-bg-900 dark:text-custom-500"
                          />
                        ) : (
                          <span className="text-sm text-bg-500">
                            {album.amount.toLocaleString()}
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
            <button
              onClick={onSubmitButtonClick}
              disabled={selectedAlbum === '' || loading}
              className="mt-6 flex h-16 items-center justify-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-md transition-all hover:bg-custom-600 disabled:bg-bg-500 dark:text-bg-800"
            >
              {!loading ? (
                <>
                  <Icon icon="tabler:photo-plus" className="h-5 w-5" />
                  Add to album
                </>
              ) : (
                <Icon icon="svg-spinners:180-ring" className="h-5 w-5" />
              )}
            </button>
          </>
        )}
      </APIComponentWithFallback>
    </Modal>
  )
}

export default AddPhotosToAlbumModal
