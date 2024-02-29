import React from 'react'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import ModuleHeader from '../../../components/general/ModuleHeader'
import { type IPhotosEntry } from '..'
import Gallery from './Gallery'
import GalleryHeader from './GalleryHeader'

function GalleryWrapper({
  photos,
  timelineDateDisplayRef,
  mobileDateDisplayRef,
  sideSliderRef,
  refreshPhotos,
  isDragging,
  galleryWrapperRef
}: {
  photos: IPhotosEntry | 'loading' | 'error'
  timelineDateDisplayRef: React.RefObject<HTMLDivElement>
  mobileDateDisplayRef: React.RefObject<HTMLDivElement>
  sideSliderRef: React.RefObject<HTMLDivElement>
  refreshPhotos: () => void
  isDragging: boolean
  galleryWrapperRef: React.RefObject<HTMLDivElement>
}): React.ReactElement {
  return (
    <div
      onScroll={e => {
        if (
          sideSliderRef.current !== null &&
          timelineDateDisplayRef.current !== null
        ) {
          if (isDragging) return

          const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

          if (window.innerWidth < 640) {
            sideSliderRef.current.style.top = `${Math.round(
              (scrollTop / scrollHeight) * clientHeight -
                (scrollTop / scrollHeight) * 48
            )}px`
            return
          }

          timelineDateDisplayRef.current.style.top = `${Math.round(
            (scrollTop / scrollHeight) * clientHeight - 36
          )}px`
        }
      }}
      ref={galleryWrapperRef}
      className="flex h-full min-h-0 w-full flex-1 flex-col overflow-y-scroll scroll-smooth px-4 sm:px-12 sm:!pr-16"
    >
      <ModuleHeader title="Photos" desc="View and manage your photos" />
      <GalleryHeader photos={photos} refreshPhotos={refreshPhotos} />
      <APIComponentWithFallback data={photos}>
        {typeof photos !== 'string' && (
          <Gallery
            photos={photos}
            timelineDateDisplayRef={timelineDateDisplayRef}
            mobileDateDisplayRef={mobileDateDisplayRef}
          />
        )}
      </APIComponentWithFallback>
    </div>
  )
}

export default GalleryWrapper
