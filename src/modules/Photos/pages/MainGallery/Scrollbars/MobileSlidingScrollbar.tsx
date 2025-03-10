import { Icon } from '@iconify/react'
import React from 'react'
import { usePhotosContext } from '@providers/PhotosProvider'

function MobileSlidingScrollbar(): React.ReactElement {
  const { galleryWrapperRef, sideSliderRef, mobileDateDisplayRef, photos } =
    usePhotosContext()

  return typeof photos !== 'string' && photos.totalItems !== 0 ? (
    <div
      ref={sideSliderRef}
      className="group absolute right-0 flex gap-2 sm:hidden"
      onTouchCancel={() => {
        sideSliderRef.current?.blur()
      }}
      onTouchEnd={() => {
        sideSliderRef.current?.blur()
      }}
      onTouchMove={e => {
        if (galleryWrapperRef.current !== null) {
          const br = galleryWrapperRef.current.getBoundingClientRect()

          const finalPosition =
            e.touches[0].clientY - br.top > 0
              ? e.touches[0].clientY - br.top
              : 0

          if (sideSliderRef.current !== null) {
            sideSliderRef.current.style.top = `${finalPosition}px`
          }

          const galleryContainerHeight = galleryWrapperRef.current.scrollHeight
          const mousePositionInGalleryContainer =
            (finalPosition / galleryWrapperRef.current.clientHeight) *
            galleryContainerHeight

          galleryWrapperRef.current.scrollTop = Math.round(
            mousePositionInGalleryContainer
          )
        }
      }}
    >
      <div
        ref={mobileDateDisplayRef}
        className="border-custom-500 bg-bg-200 dark:bg-bg-800 pointer-events-none absolute right-14 mt-1 hidden rounded-t-sm border-b-2 p-2 text-sm whitespace-nowrap shadow-md group-hover:block sm:right-3"
      ></div>
      <div className="bg-bg-200 dark:bg-bg-900 rounded-l-full p-4 shadow-xs">
        <Icon className="text-bg-500" icon="tabler:caret-up-down-filled" />
      </div>
    </div>
  ) : (
    <></>
  )
}

export default MobileSlidingScrollbar
