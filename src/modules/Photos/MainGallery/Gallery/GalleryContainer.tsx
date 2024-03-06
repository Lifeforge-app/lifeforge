/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext } from 'react'
import moment from 'moment'
import APIComponentWithFallback from '../../../../components/general/APIComponentWithFallback'
import MobileSlidingScrollbar from '../Scrollbars/MobileSlidingScrollbar'
import TimelineScrollbar from '../Scrollbars/TimelineScrollbar'
import Gallery from './Gallery'
import { PhotosContext } from '..'

function GalleryContainer(): React.ReactElement {
  const {
    photos,
    sideSliderRef,
    timelineDateDisplayRef,
    galleryWrapperRef,
    mobileDateDisplayRef,
    eachDayDimensions,
    isDragging
  } = useContext(PhotosContext)

  return (
    <>
      <div
        className="w-full flex-1 overflow-y-scroll scroll-smooth pr-16"
        onScroll={e => {
          if (
            sideSliderRef.current !== null &&
            timelineDateDisplayRef.current !== null &&
            galleryWrapperRef.current !== null &&
            mobileDateDisplayRef.current !== null
          ) {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

            let targetDate = ''

            for (const day of Object.keys(eachDayDimensions)) {
              if (eachDayDimensions[day].inGallery < scrollTop) {
                targetDate = day
              } else {
                break
              }
            }

            if (targetDate !== '') {
              timelineDateDisplayRef.current.textContent =
                moment(targetDate).format('MMM D, YYYY')

              mobileDateDisplayRef.current.textContent =
                moment(targetDate).format('MMM D, YYYY')
            }

            if (isDragging) return

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
      >
        <APIComponentWithFallback data={photos}>
          <Gallery />
        </APIComponentWithFallback>
      </div>
      <TimelineScrollbar />
      <MobileSlidingScrollbar />
    </>
  )
}

export default GalleryContainer
