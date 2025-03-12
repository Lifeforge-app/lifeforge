/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import clsx from 'clsx'
import moment from 'moment'
import { useRef } from 'react'

import { usePhotosContext } from '@modules/Photos/providers/PhotosProvider'

function TimelineScrollbar() {
  const {
    photos,
    eachDayDimensions,
    galleryWrapperRef,
    timelineDateDisplayRef
  } = usePhotosContext()
  const movingTimelineDateDisplayRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  return (
    <>
      {typeof photos !== 'string' && photos.totalItems !== 0 && (
        <>
          <div
            className="group peer absolute right-0 top-0 h-full w-0 sm:w-16"
            onClick={e => {
              if (galleryWrapperRef.current !== null) {
                const galleryContainerHeight =
                  galleryWrapperRef.current.scrollHeight

                const { top, height } = (
                  e.target as HTMLDivElement
                ).getBoundingClientRect()
                const mousePositionInGalleryContainer =
                  ((e.clientY - top) / height) * galleryContainerHeight

                galleryWrapperRef.current.scrollTo({
                  top: Math.round(mousePositionInGalleryContainer)
                })
              }
            }}
            onMouseDown={() => {
              isDraggingRef.current = true
            }}
            onMouseLeave={() => {
              isDraggingRef.current = false
            }}
            onMouseMove={e => {
              if (galleryWrapperRef.current !== null) {
                const rect = (
                  e.target as HTMLDivElement
                ).getBoundingClientRect()
                const mousePosition = Math.round(e.clientY - rect.top)

                const galleryContainerHeight =
                  galleryWrapperRef.current.scrollHeight

                const mousePositionInGalleryContainer =
                  (mousePosition / rect.height) * galleryContainerHeight

                let targetDate = ''

                for (const day of Object.keys(eachDayDimensions)) {
                  if (
                    eachDayDimensions[day].inGallery <
                    mousePositionInGalleryContainer
                  ) {
                    targetDate = day
                  } else {
                    break
                  }
                }

                if (movingTimelineDateDisplayRef.current !== null) {
                  movingTimelineDateDisplayRef.current.style.top = `${
                    mousePosition - 36
                  }px`

                  movingTimelineDateDisplayRef.current.innerHTML =
                    moment(targetDate).format('MMM D, YYYY')
                }

                if (
                  isDraggingRef.current &&
                  galleryWrapperRef.current !== null
                ) {
                  galleryWrapperRef.current.scrollTop =
                    mousePositionInGalleryContainer
                }
              }
            }}
            onMouseOut={() => {
              if (
                galleryWrapperRef.current !== null &&
                timelineDateDisplayRef.current !== null
              ) {
                const { scrollTop, scrollHeight, clientHeight } =
                  galleryWrapperRef.current

                timelineDateDisplayRef.current.style.top = `${Math.round(
                  (scrollTop / scrollHeight) * clientHeight - 36
                )}px`
              }
            }}
            onMouseUp={() => {
              isDraggingRef.current = false
            }}
          >
            {JSON.stringify(eachDayDimensions) !== '{}' && (
              <>
                {
                  // @ts-expect-error - I know what I'm doing
                  Object.entries(photos.firstDayOfYear)
                    .filter(e => e[0] !== 'NaN')
                    .map(([year, date]) => (
                      <span
                        key={year}
                        className="flex-center bg-bg-100 text-bg-500 dark:bg-bg-950 z-5 pointer-events-none absolute hidden h-4 w-full -translate-y-4 text-sm sm:flex"
                        style={{
                          top: `${eachDayDimensions[date as any]?.inTimeline}px`
                        }}
                      >
                        {year}
                      </span>
                    ))
                }
                {
                  // @ts-expect-error - I know what I'm doing
                  Object.entries(photos.firstDayOfMonth)
                    .filter(e => e[0] !== 'NaN')
                    .map(([month, date]) => (
                      <span
                        key={month}
                        className="bg-bg-400 dark:bg-bg-500 pointer-events-none absolute right-1/2 hidden size-1 -translate-y-1 translate-x-1/2 rounded-full sm:flex"
                        style={{
                          top: `${eachDayDimensions[date as any]?.inTimeline}px`
                        }}
                      ></span>
                    ))
                }
              </>
            )}
          </div>
          <div
            ref={movingTimelineDateDisplayRef}
            className={
              'border-custom-500 bg-bg-200 dark:bg-bg-800 pointer-events-none absolute right-14 z-10 hidden rounded-t-md border-b-2 p-2 text-sm shadow-md sm:right-3 sm:peer-hover:block'
            }
          ></div>
          <div
            ref={timelineDateDisplayRef}
            className={clsx(
              'border-custom-500 bg-bg-200 dark:bg-bg-800 pointer-events-none absolute right-14 z-10 hidden rounded-t-md border-b-2 p-2 text-sm shadow-md sm:right-3 sm:block',
              isDraggingRef.current && 'hidden!'
            )}
            style={{
              top: '-36px'
            }}
          ></div>
        </>
      )}
    </>
  )
}

export default TimelineScrollbar
