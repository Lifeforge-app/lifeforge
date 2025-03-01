/* eslint-disable sonarjs/no-nested-functions */
import { Icon } from '@iconify/react'

import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/buttons'
import ModalHeader from '@components/modals/ModalHeader'
import ModalWrapper from '@components/modals/ModalWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { usePhotosContext } from '@providers/PhotosProvider'
import APIRequest from '@utils/fetchData'

function AddPhotosToAlbumModal(): React.ReactElement {
  const { t } = useTranslation('modules.photos')
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
      <APIFallbackComponent data={photos}>
        {() => (
          <>
            <ModalHeader
              actionButtonIcon="tabler:plus"
              icon="tabler:photo-plus"
              title={t('modals.header.addPhotosToAlbum', {
                amount: selectedPhotos.length
              })}
              onActionButtonClick={() => {
                setModifyAlbumModalOpenType('create')
              }}
              onClose={() => {
                setOpen(false)
              }}
            />
            <ul className="relative w-full">
              <APIFallbackComponent data={albumList}>
                {albumList => (
                  <>
                    {albumList.map(album => (
                      <li
                        key={album.id}
                        className="relative flex items-center gap-6 font-medium text-bg-500 transition-all"
                      >
                        <button
                          className={clsx(
                            'flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 transition-all',
                            selectedAlbum === album.id
                              ? 'bg-bg-300 dark:bg-bg-800'
                              : 'hover:bg-bg-200 dark:hover:bg-bg-800/50'
                          )}
                          onClick={() => {
                            selectAlbum(album.id)
                          }}
                        >
                          <div className="flex-center size-10 shrink-0 rounded-md bg-bg-200 shadow-md dark:bg-bg-700/50">
                            {album.cover !== '' ? (
                              <img
                                alt=""
                                className="size-full rounded-md object-cover"
                                src={`${import.meta.env.VITE_API_HOST}/media/${
                                  album.cover
                                }?thumb=0x300`}
                              />
                            ) : (
                              <Icon
                                className="size-5 text-bg-500 dark:text-bg-500"
                                icon="tabler:library-photo"
                              />
                            )}
                          </div>
                          <div className="w-full truncate text-left text-bg-500">
                            {album.name}
                          </div>
                          {selectedAlbum === album.id ? (
                            <Icon
                              className="size-6 text-bg-800 dark:text-custom-500!"
                              icon="tabler:check"
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
              </APIFallbackComponent>
              {loading && (
                <div className="absolute left-0 top-0 size-full"></div>
              )}
            </ul>
            <Button
              className="mt-6"
              disabled={selectedAlbum === '' || loading}
              icon="tabler:photo-plus"
              loading={loading}
              onClick={() => {
                onSubmitButtonClick().catch(console.error)
              }}
            >
              {!loading ? 'Add to album' : ''}
            </Button>
          </>
        )}
      </APIFallbackComponent>
    </ModalWrapper>
  )
}

export default AddPhotosToAlbumModal
