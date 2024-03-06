/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
import React, { useContext, useEffect, useRef, useState } from 'react'
import moment from 'moment'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import MobileSlidingScrollbar from '../Scrollbars/MobileSlidingScrollbar'
import TimelineScrollbar from '../Scrollbars/TimelineScrollbar'
import Gallery from './Gallery'
import { PhotosContext } from '..'

function GalleryContainer(): React.ReactElement {
  const {
    photos
  } = useContext(PhotosContext)
  const [currentDateInViewPort, setCurrentDateInViewPort] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)

  const sideSliderRef = useRef<HTMLDivElement>(null)
  const timelineDateDisplayRef = useRef<HTMLDivElement>(null)
  const mobileDateDisplayRef = useRef<HTMLDivElement>(null)
  const galleryWrapperRef = useRef<HTMLDivElement>(null)

  const [eachDayDimensions, setEachDayDimensions] = useState<
    Record<
      string,
      {
        inTimeline: number
        inGallery: number
      }
    >
  >({})

  useEffect(() => {
    setTimeout(() => {
      if (typeof photos !== 'string' && galleryWrapperRef.current !== null) {
        const galleryContainerHeight = galleryWrapperRef.current.scrollHeight
        const wrapperHeight = galleryWrapperRef.current.offsetHeight

        setCurrentDateInViewPort(Object.keys(photos.items)[0])

        const eachDayHeight: Record<
          string,
          {
            inTimeline: number
            inGallery: number
          }
        > = {}

        for (const day of Object.keys(photos.items)) {
          const element = document.getElementById(day)!
          const { y, height } = element.getBoundingClientRect()
          eachDayHeight[day] = {
            inTimeline:
              Number(((y + height) / galleryContainerHeight).toPrecision(2)) *
              wrapperHeight,
            inGallery: y
          }
        }

        setEachDayDimensions(eachDayHeight)
      }
    }, 1000)
  }, [photos, galleryWrapperRef])

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
      <TimelineScrollbar
        photos={photos}
        galleryWrapperRef={galleryWrapperRef}
        timelineDateDisplayRef={timelineDateDisplayRef}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
        eachDayDimensions={eachDayDimensions}
        currentDateInViewPort={currentDateInViewPort}
      />
      <MobileSlidingScrollbar
        galleryWrapperRef={galleryWrapperRef}
        sideSliderRef={sideSliderRef}
        mobileDateDisplayRef={mobileDateDisplayRef}
      />
    </>
  )
}

export default GalleryContainer
