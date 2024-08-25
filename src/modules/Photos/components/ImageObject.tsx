/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import {
  type IPhotosEntryDimensionsAll,
  type IPhotosEntry,
  type IPhotoAlbumEntryItem
} from '@interfaces/photos_interfaces'
import { usePhotosContext } from '../../../providers/PhotosProvider'
import ImagePreviewModal from './modals/ImagePreviewModal'

const LLI = LazyLoadImage as any

function ImageObject({
  photo,
  details,
  selected,
  toggleSelected,
  selectedPhotosLength,
  beingDisplayedInAlbum,
  refreshAlbumData,
  refreshPhotos,
  setPhotos,
  style
}: {
  photo: any
  details: IPhotosEntry
  selected: boolean
  toggleSelected: (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => void
  selectedPhotosLength: number
  beingDisplayedInAlbum: boolean
  refreshAlbumData?: () => void
  refreshPhotos: () => void
  setPhotos:
    | React.Dispatch<React.SetStateAction<IPhotosEntryDimensionsAll>>
    | React.Dispatch<React.SetStateAction<IPhotoAlbumEntryItem[]>>
  style?: React.CSSProperties
  [key: string]: any
}): React.ReactElement {
  const { ready } = usePhotosContext()
  const [imagePreviewModalOpen, setImagePreviewOpen] = useState(false)

  return (
    <div
      onClick={e => {
        if (selectedPhotosLength > 0) {
          toggleSelected(e)
        }
      }}
      style={style}
      className={`group/image relative size-full min-w-20 overflow-hidden ${
        selected ? 'bg-custom-500/20' : 'bg-bg-200 dark:bg-bg-800'
      } transition-all ${selectedPhotosLength > 0 ? 'cursor-pointer' : ''}`}
    >
      {(ready || beingDisplayedInAlbum) &&
        photo.src.endsWith('/undefined?thumb=0x300') === false && (
          <>
            <div
              className={`size-full transition-all duration-300 ${
                selected ? 'p-4' : ''
              } ${selectedPhotosLength > 0 ? 'pointer-events-none' : ''}`}
            >
              <button
                className={`relative size-full object-cover ${
                  selected ? 'rounded-md' : ''
                }`}
                onClick={() => {
                  setImagePreviewOpen(true)
                }}
              >
                <LLI
                  alt=""
                  src={photo.src}
                  delayTime={300}
                  delayMethod="debounce"
                  threshold={50}
                  useIntersectionObserver={false}
                  className="size-full object-cover"
                />
              </button>
              <ImagePreviewModal
                isOpen={imagePreviewModalOpen}
                onClose={() => {
                  setImagePreviewOpen(false)
                }}
                data={details}
                img={photo.src.split('?')[0]}
                setPhotos={setPhotos}
                beingDisplayedInAlbum={beingDisplayedInAlbum}
                refreshAlbumData={refreshAlbumData}
                refreshPhotos={refreshPhotos}
              />
            </div>
            {!selected && (
              <div className="pointer-events-none absolute top-0 h-12 w-full bg-gradient-to-t from-transparent to-black/50 opacity-0 transition-all group-hover/image:opacity-100" />
            )}
            <button
              onClick={toggleSelected}
              className={`group/select-button flex-center absolute left-2.5 top-2.5 size-6 rounded-full transition-all  ${
                selected
                  ? 'flex bg-custom-500 opacity-100'
                  : 'hidden bg-bg-200 opacity-50 hover:!bg-bg-100 hover:!opacity-100 group-hover/image:flex'
              }`}
            >
              <Icon
                icon="tabler:check"
                className={`stroke-bg-900 stroke-[2px] text-bg-800 transition-all ${
                  !selected &&
                  'group-hover/select-button:stroke-bg-900 group-hover/select-button:text-bg-800'
                }`}
              />
            </button>
            <div className="absolute right-2 top-2 flex items-center gap-2 text-bg-200 opacity-50">
              {details.has_raw && (
                <Icon icon="tabler:letter-r" className="size-5" />
              )}
              {!beingDisplayedInAlbum && details.is_in_album && (
                <Icon icon="tabler:library-photo" className="size-5" />
              )}
              {details.is_favourite && (
                <Icon icon="tabler:star" className="size-5" />
              )}
            </div>
          </>
        )}
    </div>
  )
}

export default ImageObject
