/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useEffect, useRef, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import GalleryWrapper from './Gallery/GalleryWrapper'
import MobileSlidingScrollbar from './Scrollbars/MobileSlidingScrollbar'
import TimelineScrollbar from './Scrollbars/TimelineScrollbar'

export interface IPhotosEntryItem {
  collectionId: string
  collectionName: string
  created: string
  event: string
  id: string
  image: string
  is_deleted: boolean
  filesize: number
  name: string
  raw: string
  shot_time: string
  updated: string
  width: number
  height: number
}

export interface IPhotosEntry {
  totalItems: number
  items: Record<string, IPhotosEntryItem[]>
  firstDayOfYear: Record<string, string>
  firstDayOfMonth: Record<string, string>
}

function Photos(): React.ReactElement {
  const [photos, refreshPhotos] = useFetch<IPhotosEntry>('photos/entry/list')
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

        console.log(eachDayDimensions)
        setEachDayDimensions(eachDayHeight)
      }
    }, 1000)
  }, [photos, galleryWrapperRef])

  return (
    <section className="relative flex min-h-0 w-full">
      <GalleryWrapper
        photos={photos}
        refreshPhotos={refreshPhotos}
        timelineDateDisplayRef={timelineDateDisplayRef}
        sideSliderRef={sideSliderRef}
        isDragging={isDragging}
        galleryWrapperRef={galleryWrapperRef}
        eachDayDimensions={eachDayDimensions}
      />
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
    </section>
  )
}

export default Photos
