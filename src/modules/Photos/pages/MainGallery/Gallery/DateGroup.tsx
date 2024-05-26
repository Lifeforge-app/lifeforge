/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useEffect, useRef, useState } from 'react'
import Gallery from 'react-photo-gallery'
import { toast } from 'react-toastify'
import useResizeObserver from 'use-resize-observer'
import useOnScreen from '@hooks/useOnScreen'
import {
  type IPhotosEntryDimensionsAll,
  type IPhotosEntry,
  type IPhotosEntryDimensionsItem
} from '@typedec/Photos'
import { usePhotosContext } from '../../../../../providers/PhotosProvider'
import ImageObject from '../../../components/ImageObject'

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
    setPhotoDimensions,
    refreshPhotos,
    updateEachDayDimensions,
    ready
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
      fetch(`${import.meta.env.VITE_API_HOST}/photos/entry/list?date=${date}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      })
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
      ref={el => {
        ref(el)

        // @ts-expect-error - I know what I'm doing
        thisRef.current = el
      }}
      id={date}
      key={date}
      className="group"
    >
      {(!ready || isOnScreen) && (
        <>
          <h2 className="mb-2 flex items-end gap-2 text-xl font-semibold">
            <div
              className={`mb-0.5 overflow-hidden transition-all ${
                !isSelectedAll && 'max-w-0 group-hover:max-w-[2rem]'
              }`}
            >
              <button
                onClick={toggleSelectAll}
                className={`group/checkbox flex-center flex rounded-full border-2  p-0.5 transition-all ${
                  isSelectedAll
                    ? 'border-custom-500 bg-custom-500'
                    : 'border-bg-500 hover:!border-custom-500'
                }`}
              >
                <Icon
                  icon="uil:check"
                  className={`h-4 w-4  !stroke-[1px]  transition-all  ${
                    isSelectedAll
                      ? 'stroke-bg-100 text-bg-100 dark:stroke-bg-900 dark:text-bg-800'
                      : 'stroke-bg-500 text-bg-500 group-hover/checkbox:!stroke-custom-500 group-hover/checkbox:!text-custom-500'
                  }`}
                />
              </button>
            </div>
            {moment(date).format('LL')}
            <span className="mb-0.5 block text-sm font-normal text-bg-500">
              ({photosDimensions.length.toLocaleString()})
            </span>
          </h2>
          <Gallery
            targetRowHeight={200}
            photos={photosDimensions.map(image => ({
              src: `${import.meta.env.VITE_API_HOST}/media/${
                typeof allPhotos !== 'string' ? allPhotos.collectionId : ''
              }/${image.id}/${
                photos?.find(photo => photo.id === image.id)?.image
              }?thumb=0x300`,
              width: image.width / 20,
              height: image.height / 20,
              key: image.id
            }))}
            margin={3}
            renderImage={({ photo, margin }) => (
              <ImageObject
                beingDisplayedInAlbum={false}
                photo={photo}
                refreshPhotos={refreshPhotos}
                setPhotos={
                  setPhotoDimensions as React.Dispatch<
                    React.SetStateAction<IPhotosEntryDimensionsAll>
                  >
                }
                details={
                  photos !== undefined
                    ? photos.find(image => image.id === photo.key) ?? {
                        id: photo.key ?? '',
                        image: '',
                        has_raw: false,
                        is_in_album: false,
                        is_favourite: false
                      }
                    : {
                        id: photo.key ?? '',
                        image: '',
                        has_raw: false,
                        is_in_album: false,
                        is_favourite: false
                      }
                }
                margin={margin ?? ''}
                selected={
                  selectedPhotos.find(image => image === photo.key) !==
                  undefined
                }
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
                selectedPhotosLength={selectedPhotos.length}
              />
            )}
          />
        </>
      )}
    </div>
  )
}

export default DateGroup
