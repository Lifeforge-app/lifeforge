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
import fetchAPI from '@utils/fetchAPI'

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
    if (
      typeof photos === 'string' ||
      typeof albumList === 'string' ||
      selectedAlbum === ''
    ) {
      return
    }

    setLoading(true)

    try {
      await fetchAPI(`photos/album/add-photos/${selectedAlbum}`, {
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
        }
      })

      setSelectedPhotos([])
      setOpen(false)
      updateAlbumList()
      updatePhotos()
    } catch {
      console.error('Failed to add photos to album')
    } finally {
      setLoading(false)
    }
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
                        className="text-bg-500 relative flex items-center gap-6 font-medium transition-all"
                      >
                        <button
                          className={clsx(
                            'flex w-full items-center gap-6 rounded-lg p-4 whitespace-nowrap transition-all',
                            selectedAlbum === album.id
                              ? 'bg-bg-300 dark:bg-bg-800'
                              : 'hover:bg-bg-200 dark:hover:bg-bg-800/50'
                          )}
                          onClick={() => {
                            selectAlbum(album.id)
                          }}
                        >
                          <div className="flex-center bg-bg-200 dark:bg-bg-700/50 size-10 shrink-0 rounded-md shadow-md">
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
                                className="text-bg-500 dark:text-bg-500 size-5"
                                icon="tabler:library-photo"
                              />
                            )}
                          </div>
                          <div className="text-bg-500 w-full truncate text-left">
                            {album.name}
                          </div>
                          {selectedAlbum === album.id ? (
                            <Icon
                              className="text-bg-800 dark:text-custom-500! size-6"
                              icon="tabler:check"
                            />
                          ) : (
                            <span className="text-bg-500 text-sm">
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
                <div className="absolute top-0 left-0 size-full"></div>
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
