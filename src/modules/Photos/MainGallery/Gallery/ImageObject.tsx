/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext } from 'react'
import { PhotosContext, type IPhotosEntryItem } from '../..'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Icon } from '@iconify/react/dist/iconify.js'

function ImageObject({
  photo,
  margin,
  details,
  selected,
  toggleSelected,
  selectedPhotosLength,
  beingDisplayedInAlbum
}: {
  photo: any
  details: IPhotosEntryItem
  margin: string
  selected: boolean
  toggleSelected: () => void
  selectedPhotosLength: number
  beingDisplayedInAlbum: boolean
}): React.ReactElement {
  const { galleryWrapperRef } = useContext(PhotosContext)

  return (
    <div
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
      className={`group/image relative min-w-[5rem] overflow-hidden ${
        selected ? 'bg-custom-500/20 p-4' : 'bg-bg-200 dark:bg-bg-800'
      } transition-all`}
    >
      <LazyLoadImage
        src={photo.src}
        className={`relative h-full w-full object-cover ${
          selected && 'rounded-md'
        }`}
        delayTime={300}
        threshold={50}
        useIntersectionObserver={false}
      />
      {!selected && (
        <div className="absolute top-0 h-12 w-full bg-gradient-to-t from-transparent to-black/50 opacity-0 transition-all group-hover/image:opacity-100" />
      )}
      <button
        onClick={toggleSelected}
        className={`group/select-button absolute left-2.5 top-2.5 h-6 w-6 items-center justify-center rounded-full transition-all  ${
          selected
            ? 'flex bg-custom-500 opacity-100'
            : 'hidden bg-bg-200 opacity-50 hover:!bg-bg-100 hover:!opacity-100 group-hover/image:flex'
        }`}
      >
        <Icon
          icon="tabler:check"
          className={`stroke-bg-900 stroke-[2px] text-bg-900 transition-all ${
            !selected &&
            'group-hover/select-button:stroke-bg-900 group-hover/select-button:text-bg-900'
          }`}
        />
      </button>
      {!beingDisplayedInAlbum && details.album !== '' && (
        <span className="absolute right-2 top-2 text-bg-200 opacity-50">
          <Icon icon="tabler:library-photo" className="h-5 w-5" />
        </span>
      )}
    </div>
  )
}

export default ImageObject
