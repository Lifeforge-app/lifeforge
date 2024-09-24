import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React, { useEffect, useState } from 'react'
import Button from '@components/ButtonsAndInputs/Button'
import ModalWrapper from '@components/Modals/ModalWrapper'
import ModalHeader from '@components/Modals/ModalHeader'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'
import APIRequest from '@utils/fetchData'

function AddPhotosToAlbumModal(): React.ReactElement {
  const {
    photos,
    albumList,
    selectedPhotos,
    setSelectedPhotos,
    setModifyAlbumModalOpenType,
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
      successInfo: 'add',
      failureInfo: 'add',
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
    <ModalWrapper isOpen={isOpen} minWidth="40rem">
      <APIComponentWithFallback data={photos}>
        {() => (
          <>
            <ModalHeader
              icon="tabler:photo-plus"
              needTranslate={false}
              title={t('modals.header.addPhotosToAlbum', {
                amount: selectedPhotos.length
              })}
              onClose={() => {
                setOpen(false)
              }}
              actionButtonIcon="tabler:plus"
              onActionButtonClick={() => {
                setModifyAlbumModalOpenType('create')
              }}
            />
            <ul className="relative w-full">
              <APIComponentWithFallback data={albumList}>
                {albumList => (
                  <>
                    {albumList.map(album => (
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
                          <div className="flex-center flex size-10 shrink-0 rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                            {album.cover !== '' ? (
                              <img
                                src={`${import.meta.env.VITE_API_HOST}/media/${
                                  album.cover
                                }?thumb=0x300`}
                                alt=""
                                className="size-full rounded-md object-cover"
                              />
                            ) : (
                              <Icon
                                icon="tabler:library-photo"
                                className="size-5 text-bg-500 dark:text-bg-500"
                              />
                            )}
                          </div>
                          <div className="w-full truncate text-left text-bg-500">
                            {album.name}
                          </div>
                          {selectedAlbum === album.id ? (
                            <Icon
                              icon="tabler:check"
                              className="size-6 text-bg-800 dark:!text-custom-500"
                            />
                          ) : (
                            <span className="text-sm text-bg-500">
                              {album.amount?.toLocaleString()}
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </>
                )}
              </APIComponentWithFallback>
              {loading && (
                <div className="absolute left-0 top-0 size-full"></div>
              )}
            </ul>
            <Button
              onClick={() => {
                onSubmitButtonClick().catch(console.error)
              }}
              disabled={selectedAlbum === '' || loading}
              loading={loading}
              className="mt-6"
              icon="tabler:photo-plus"
            >
              {!loading ? 'Add to album' : ''}
            </Button>
          </>
        )}
      </APIComponentWithFallback>
    </ModalWrapper>
  )
}

export default AddPhotosToAlbumModal
