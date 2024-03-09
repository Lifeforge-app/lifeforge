/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from 'moment'
import React, { useContext, useEffect, useRef } from 'react'
import Gallery from 'react-photo-gallery'
import ImageObject from '../../../components/ImageObject'
import { Icon } from '@iconify/react/dist/iconify.js'
import useResizeObserver from 'use-resize-observer'
import {
  type IPhotosEntryItem,
  PhotosContext
} from '../../../../../providers/PhotosProvider'
import useOnScreen from '../../../../../hooks/useOnScreen'

function DateGroup({
  date,
  photos,
  selectedPhotos,
  setSelectedPhotos,
  toggleSelectAll,
  isSelectedAll
}: {
  date: string
  photos: IPhotosEntryItem[]
  selectedPhotos: string[]
  setSelectedPhotos: (photos: string[]) => void
  toggleSelectAll: () => void
  isSelectedAll: boolean
}): React.ReactElement {
  const {
    photos: allPhotos,
    updateEachDayDimensions,
    ready
  } = useContext(PhotosContext)
  const thisRef = useRef<HTMLDivElement>(null)
  const isOnScreen = useOnScreen(thisRef)
  const { ref, height = 1 } = useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (typeof allPhotos !== 'string') {
      if (height > 100) {
        if (thisRef.current !== null) {
          thisRef.current.style.height = `${height}px`
        }

        if (
          date ===
          Object.keys(allPhotos.items)[Object.keys(allPhotos.items).length - 1]
        ) {
          updateEachDayDimensions()
        }
      }
    }
  }, [allPhotos, height])

  return (
    <div
      ref={el => {
        ref(el)
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
                className={`group/checkbox flex items-center justify-center rounded-full border-2  p-0.5 transition-all ${
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
              ({photos.length.toLocaleString()})
            </span>
          </h2>
          <Gallery
            targetRowHeight={200}
            photos={photos.map(image => ({
              src: `${import.meta.env.VITE_POCKETBASE_ENDPOINT}/api/files/${
                typeof allPhotos !== 'string' ? allPhotos.collectionId : ''
              }/${image.id}/${image.image}?thumb=0x300`,
              width: image.width / 20,
              height: image.height / 20,
              key: image.id
            }))}
            margin={3}
            renderImage={({ photo, margin }) => (
              <ImageObject
                beingDisplayedInAlbum={false}
                photo={photo}
                details={photos.find(image => image.id === photo.key)!}
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
                        const lastSelectedIndex = allPhotos.items[
                          date
                        ].findIndex(
                          image =>
                            image.id ===
                            selectedPhotos[selectedPhotos.length - 1]
                        )
                        const currentIndex = allPhotos.items[date].findIndex(
                          image => image.id === photo.key
                        )
                        const range = allPhotos.items[date].slice(
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
