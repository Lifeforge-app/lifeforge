import { Icon } from '@iconify/react'
import clsx from 'clsx'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useRef, useState } from 'react'
import PhotoAlbum from 'react-photo-album'
import { toast } from 'react-toastify'
import useResizeObserver from 'use-resize-observer'

import useOnScreen from '@modules/Photos/hooks/useOnScreen'
import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

import ImageObject from '../../../components/ImageObject'
import {
  type IPhotosEntry,
  type IPhotosEntryDimensionsItem
} from '../../../interfaces/photos_interfaces'

function DateGroup({
  date,
  photosDimensions,
  selectedPhotos,
  setSelectedPhotos,
  toggleSelectAll,
  isSelectedAll
}: {
  date: string
  photosDimensions: IPhotosEntryDimensionsItem[]
  selectedPhotos: string[]
  setSelectedPhotos: (photos: string[]) => void
  toggleSelectAll: () => void
  isSelectedAll: boolean
}): React.ReactElement {
  const {
    photos: allPhotos,
    updateEachDayDimensions,
    ready,
    setImagePreviewModalOpenFor
  } = usePhotosContext()
  const thisRef = useRef<HTMLDivElement>(null)
  const [photos, setPhotos] = useState<IPhotosEntry[]>()
  const isOnScreen = useOnScreen(thisRef)

  const { ref, height = 1 } = useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (typeof allPhotos !== 'string') {
      if (height > 100) {
        if (thisRef.current !== null) {
          thisRef.current.style.height = `${height}px`
        }

        if (date === allPhotos.items[allPhotos.items.length - 1][0]) {
          updateEachDayDimensions()
        }
      }
    }
  }, [allPhotos, height])

  useEffect(() => {
    if (photos === undefined && ready && isOnScreen) {
      fetch(
        `${import.meta.env.VITE_API_HOST}/photos/entries/list?date=${date}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${cookieParse(document.cookie).token}`
          }
        }
      )
        .then(async res => {
          try {
            const data = await res.json()
            if (!res.ok || data.state !== 'success') {
              throw new Error(data.message)
            }
            setPhotos(data.data)
          } catch (err) {
            throw new Error(err as string)
          }
        })
        .catch(err => {
          toast.error(`Failed to fetch data from server. ${err.message}`)
          console.error(err)
        })
    }
  }, [isOnScreen, ready, photosDimensions])

  return (
    <div
      key={date}
      ref={el => {
        ref(el)

        thisRef.current = el
      }}
      className="group"
      id={date}
    >
      {(!ready || isOnScreen) && (
        <>
          <h2 className="mb-2 flex items-end gap-2 text-xl font-semibold">
            <div
              className={clsx(
                'mb-0.5 overflow-hidden transition-all',
                !isSelectedAll && 'max-w-0 group-hover:max-w-8'
              )}
            >
              <button
                className={clsx(
                  'group/checkbox flex-center rounded-full border-2 p-0.5 transition-all',
                  isSelectedAll
                    ? 'border-custom-500 bg-custom-500'
                    : 'border-bg-500 hover:border-custom-500!'
                )}
                onClick={toggleSelectAll}
              >
                <Icon
                  className={clsx(
                    'size-4 !stroke-[1px] transition-all',
                    isSelectedAll
                      ? 'stroke-bg-100 text-bg-50 dark:stroke-bg-900 dark:text-bg-800'
                      : 'stroke-bg-500 text-bg-500 group-hover/checkbox:stroke-custom-500! group-hover/checkbox:text-custom-500!'
                  )}
                  icon="uil:check"
                />
              </button>
            </div>
            {moment(date).format('LL')}
            <span className="text-bg-500 mb-0.5 block text-sm font-normal">
              ({photosDimensions.length.toLocaleString()})
            </span>
          </h2>
          <PhotoAlbum
            layout="rows"
            photos={photosDimensions.map(image => ({
              src: `${import.meta.env.VITE_API_HOST}/media/${
                typeof allPhotos !== 'string' ? allPhotos.collectionId : ''
              }/${image.id}/${
                photos?.find(photo => photo.id === image.id)?.image
              }?thumb=0x300`,
              width: image.width,
              height: image.height,
              key: image.id
            }))}
            renderPhoto={({
              photo,
              imageProps: { style, ...restImageProps }
            }) => (
              <ImageObject
                beingDisplayedInAlbum={false}
                details={
                  photos?.find(image => image.id === photo.key) ?? {
                    id: photo.key ?? '',
                    collectionId: '',
                    image: '',
                    has_raw: false,
                    is_in_album: false,
                    is_favourite: false
                  }
                }
                photo={photo}
                style={style}
                {...restImageProps}
                selected={
                  selectedPhotos.find(image => image === photo.key) !==
                  undefined
                }
                selectedPhotosLength={selectedPhotos.length}
                setImagePreviewOpenFor={setImagePreviewModalOpenFor}
                toggleSelected={(
                  e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
                ): void => {
                  if (photo.key !== undefined) {
                    if (
                      selectedPhotos.find(image => image === photo.key) !==
                      undefined
                    ) {
                      setSelectedPhotos(
                        selectedPhotos.filter(image => image !== photo.key)
                      )
                    } else {
                      if (e.shiftKey && typeof allPhotos !== 'string') {
                        const photos = allPhotos.items.flatMap(e => e[1])

                        const lastSelectedIndex = photos.findIndex(
                          image =>
                            image.id ===
                            selectedPhotos[selectedPhotos.length - 1]
                        )
                        const currentIndex = photos.findIndex(
                          image => image.id === photo.key
                        )
                        const range = photos.slice(
                          Math.min(lastSelectedIndex, currentIndex),
                          Math.max(lastSelectedIndex, currentIndex) + 1
                        )
                        setSelectedPhotos(
                          Array.from(
                            new Set([
                              ...selectedPhotos,
                              ...range.map(image => image.id)
                            ])
                          )
                        )
                      } else {
                        setSelectedPhotos([...selectedPhotos, photo.key])
                      }
                    }
                  }
                }}
              />
            )}
            spacing={8}
          />
        </>
      )}
    </div>
  )
}

export default DateGroup
