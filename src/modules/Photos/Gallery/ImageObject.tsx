/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { type IPhotosEntryItem } from '..'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Icon } from '@iconify/react/dist/iconify.js'

function ImageObject({
  photo,
  margin,
  selected,
  toggleSelected,
  selectedPhotosLength
}: {
  photo: any
  details: IPhotosEntryItem
  margin: string
  selected: boolean
  toggleSelected: () => void
  selectedPhotosLength: number
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        if (selectedPhotosLength > 0) {
          toggleSelected()
        }
      }}
      style={{
        margin,
        height: photo.height,
        width: photo.width
      }}
      className={`group/image relative overflow-hidden ${
        selected ? 'bg-custom-500/20 p-4' : 'bg-bg-200 dark:bg-bg-800'
      } transition-all`}
    >
      <LazyLoadImage
        src={photo.src}
        className={`h-full w-full object-cover ${selected && 'rounded-md'}`}
        delayTime={300}
        threshold={50}
        useIntersectionObserver={false}
      />
      <button
        onClick={toggleSelected}
        className={`group/select-button absolute left-2.5 top-2.5 h-6 w-6 items-center justify-center rounded-full transition-all  ${
          selected
            ? 'flex bg-custom-500'
            : 'hidden bg-bg-500 hover:!bg-bg-100 group-hover/image:flex'
        }`}
      >
        <Icon
          icon="tabler:check"
          className={`stroke-bg-100 stroke-[2px] text-bg-100 transition-all dark:stroke-bg-900 dark:text-bg-900 ${
            !selected &&
            'group-hover/select-button:stroke-bg-900 group-hover/select-button:text-bg-900'
          }`}
        />
      </button>
    </button>
  )
}

export default ImageObject