/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { useEffect, useRef, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import moment from 'moment'
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

function Photos(): JSX.Element {
  const [photos, refreshPhotos] = useFetch<IPhotosEntry>('photos/entry/list')
  const [isDragging, setIsDragging] = useState(false)

  const sideSliderRef = useRef<HTMLDivElement>(null)
  const timelineDateDisplayRef = useRef<HTMLDivElement>(null)
  const mobileDateDisplayRef = useRef<HTMLDivElement>(null)
  const galleryWrapperRef = useRef<HTMLDivElement>(null)

  return (
    <section className="relative flex min-h-0 w-full">
      <GalleryWrapper
        photos={photos}
        refreshPhotos={refreshPhotos}
        timelineDateDisplayRef={timelineDateDisplayRef}
        mobileDateDisplayRef={mobileDateDisplayRef}
        sideSliderRef={sideSliderRef}
        isDragging={isDragging}
        galleryWrapperRef={galleryWrapperRef}
      />
      <TimelineScrollbar
        photos={photos}
        galleryWrapperRef={galleryWrapperRef}
        timelineDateDisplayRef={timelineDateDisplayRef}
        isDragging={isDragging}
        setIsDragging={setIsDragging}
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
