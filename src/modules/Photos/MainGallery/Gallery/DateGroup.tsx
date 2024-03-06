/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from 'moment'
import React, { useContext, useEffect } from 'react'
import Gallery from 'react-photo-gallery'
import ImageObject from './ImageObject'
import { Icon } from '@iconify/react/dist/iconify.js'
import { type IPhotosEntryItem, PhotosContext } from '..'
import useResizeObserver from 'use-resize-observer'

function DateGroup({
  date,
  photos,
  toggleSelectAll,
  isSelectedAll
}: {
  date: string
  photos: IPhotosEntryItem[]
  toggleSelectAll: () => void
  isSelectedAll: boolean
}): React.ReactElement {
  const { photos: allPhotos, updateEachDayDimensions } =
    useContext(PhotosContext)
  const { setSelectedPhotos, selectedPhotos } = useContext(PhotosContext)
  const { ref, height = 1 } = useResizeObserver<HTMLDivElement>()

  useEffect(() => {
    if (typeof allPhotos !== 'string') {
      if (date === Object.keys(allPhotos.items)[0]) {
        if (height > 20) {
          updateEachDayDimensions()
        }
      }
    }
  }, [allPhotos, height])

  return (
    <div ref={ref} id={date} key={date} className="group">
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
                  ? 'stroke-bg-100 text-bg-100 dark:stroke-bg-900 dark:text-bg-900'
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
            image.collectionId
          }/${image.id}/${image.image}?thumb=0x300`,
          width: image.width / 20,
          height: image.height / 20,
          key: image.id
        }))}
        margin={3}
        renderImage={({ photo, margin }) => (
          <ImageObject
            photo={photo}
            details={photos.find(image => image.id === photo.key)!}
            margin={margin ?? ''}
            selected={
              selectedPhotos.find(image => image === photo.key) !== undefined
            }
            toggleSelected={() => {
              if (photo.key !== undefined) {
                if (
                  selectedPhotos.find(image => image === photo.key) !==
                  undefined
                ) {
                  setSelectedPhotos(
                    selectedPhotos.filter(image => image !== photo.key)
                  )
                } else {
                  setSelectedPhotos([...selectedPhotos, photo.key])
                }
              }
            }}
            selectedPhotosLength={selectedPhotos.length}
          />
        )}
      />
    </div>
  )
}

export default DateGroup
