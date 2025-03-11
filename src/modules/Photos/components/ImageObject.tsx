import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import {
  type IPhotoAlbumEntryItem,
  type IPhotosEntry
} from '@interfaces/photos_interfaces'

import useThemeColors from '@hooks/useThemeColor'

import { usePhotosContext } from '../../../providers/PhotosProvider'

const LLI = LazyLoadImage as any

function ImageObject({
  photo,
  details,
  selected,
  toggleSelected,
  selectedPhotosLength,
  beingDisplayedInAlbum,
  style,
  setImagePreviewOpenFor
}: {
  photo: any
  details: IPhotosEntry
  selected: boolean
  toggleSelected: (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>
  ) => void
  selectedPhotosLength: number
  beingDisplayedInAlbum: boolean
  style?: React.CSSProperties
  setImagePreviewOpenFor: (
    details: (IPhotoAlbumEntryItem | IPhotosEntry) | null
  ) => void
}): React.ReactElement {
  const { componentBg } = useThemeColors()
  const { ready } = usePhotosContext()

  return (
    <div
      className={clsx(
        'group/image relative size-full min-w-20 overflow-hidden transition-all',
        selected ? 'bg-custom-500/20' : componentBg,
        selectedPhotosLength > 0 && 'cursor-pointer'
      )}
      role="button"
      style={style}
      tabIndex={0}
      onClick={e => {
        if (selectedPhotosLength > 0) {
          toggleSelected(e)
        }
      }}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (selectedPhotosLength > 0) {
            toggleSelected(e as any)
          }
        }
      }}
    >
      {(ready || beingDisplayedInAlbum) &&
        photo.src.endsWith('/undefined?thumb=0x300') === false && (
          <>
            <div
              className={clsx(
                'size-full transition-all duration-300',
                selected && 'p-4',
                selectedPhotosLength > 0 && 'pointer-events-none'
              )}
            >
              <button
                className={clsx(
                  'relative size-full object-cover',
                  selected && 'rounded-md'
                )}
                onClick={() => {
                  setImagePreviewOpenFor(details)
                }}
              >
                <LLI
                  alt=""
                  className="size-full object-cover"
                  delayMethod="debounce"
                  delayTime={300}
                  src={photo.src}
                  threshold={50}
                  useIntersectionObserver={false}
                />
              </button>
            </div>
            {!selected && (
              <div className="bg-linear-to-t pointer-events-none absolute top-0 h-12 w-full from-transparent to-black/50 opacity-0 transition-all group-hover/image:opacity-100" />
            )}
            <button
              className={clsx(
                'group/select-button flex-center absolute left-2.5 top-2.5 size-6 rounded-full transition-all',
                selected
                  ? 'bg-custom-500 flex opacity-100'
                  : 'bg-bg-200 hover:bg-bg-100! hover:opacity-100! hidden opacity-50 group-hover/image:flex'
              )}
              onClick={toggleSelected}
            >
              <Icon
                className={clsx(
                  'stroke-bg-900 text-bg-800 stroke-[2px] transition-all',
                  !selected &&
                    'group-hover/select-button:stroke-bg-900 group-hover/select-button:text-bg-800'
                )}
                icon="tabler:check"
              />
            </button>
            <div className="text-bg-200 absolute right-2 top-2 flex items-center gap-2 opacity-50">
              {details.has_raw && (
                <Icon className="size-5" icon="tabler:letter-r" />
              )}
              {!beingDisplayedInAlbum && details.is_in_album && (
                <Icon className="size-5" icon="tabler:library-photo" />
              )}
              {details.is_favourite && (
                <Icon className="size-5" icon="tabler:star" />
              )}
            </div>
          </>
        )}
    </div>
  )
}

export default ImageObject
