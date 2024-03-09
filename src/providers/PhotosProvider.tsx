/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
import moment from 'moment'
import React, { createContext, useRef, useState } from 'react'
import useFetch from '../hooks/useFetch'
import { Outlet } from 'react-router'

export interface IPhotosEntryItem {
  album: string
  id: string
  image: string
  is_deleted: boolean
  name: string
  hasRaw: boolean
  shot_time: string
  width: number
  height: number
}

export interface IPhotosEntry {
  totalItems: number
  items: Record<string, IPhotosEntryItem[]>
  firstDayOfYear: Record<string, string>
  firstDayOfMonth: Record<string, string>
  collectionId: string
}

export interface IPhotosAlbum {
  amount: number
  is_public: boolean
  collectionId: string
  collectionName: string
  created: string
  id: string
  name: string
  cover: string
  updated: string
}

const PHOTOS_DATA: {
  ready: boolean
  photos: IPhotosEntry | 'loading' | 'error'
  albumList: IPhotosAlbum[] | 'loading' | 'error'
  eachDayDimensions: Record<
    string,
    {
      inTimeline: number
      inGallery: number
    }
  >
  selectedPhotos: string[]
  hidePhotosInAlbum: boolean
  isCreateAlbumModalOpen: boolean
  isAddPhotosToAlbumModalOpen: boolean
  isDeletePhotosConfirmationModalOpen: boolean
  isDragging: boolean
  setReady: React.Dispatch<React.SetStateAction<boolean>>
  setHidePhotosInAlbum: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>
  setCreateAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAddPhotosToAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeletePhotosConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  updateEachDayDimensions: () => void
  refreshAlbumList: () => void
  refreshPhotos: () => void
  sideSliderRef:
    | React.RefObject<HTMLDivElement>
    | {
        current: null
      }
  timelineDateDisplayRef:
    | React.RefObject<HTMLDivElement>
    | {
        current: null
      }
  mobileDateDisplayRef:
    | React.RefObject<HTMLDivElement>
    | {
        current: null
      }
  galleryWrapperRef:
    | React.RefObject<HTMLDivElement>
    | {
        current: null
      }
} = {
  ready: false,
  photos: 'loading',
  albumList: 'loading',
  eachDayDimensions: {},
  selectedPhotos: [],
  hidePhotosInAlbum: false,
  isCreateAlbumModalOpen: false,
  isAddPhotosToAlbumModalOpen: false,
  isDeletePhotosConfirmationModalOpen: false,
  setReady: () => {},
  setHidePhotosInAlbum: () => {},
  setSelectedPhotos: () => {},
  setCreateAlbumModalOpen: () => {},
  setAddPhotosToAlbumModalOpen: () => {},
  setDeletePhotosConfirmationModalOpen: () => {},
  updateEachDayDimensions: () => {},
  refreshPhotos: () => {},
  refreshAlbumList: () => {},
  sideSliderRef: {
    current: null
  },
  timelineDateDisplayRef: {
    current: null
  },
  mobileDateDisplayRef: {
    current: null
  },
  galleryWrapperRef: {
    current: null
  }
}

export const PhotosContext = createContext(PHOTOS_DATA)

function Photos(): React.ReactElement {
  const [ready, setReady] = useState(false)
  const [hidePhotosInAlbum, setHidePhotosInAlbum] = useState(false)
  const [photos, refreshPhotos] = useFetch<IPhotosEntry>(
    `photos/entry/list${hidePhotosInAlbum ? '?hideInAlbum=true' : ''}`
  )
  const [albumList, refreshAlbumList] =
    useFetch<IPhotosAlbum[]>('photos/album/list')

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [isCreateAlbumModalOpen, setCreateAlbumModalOpen] = useState(false)
  const [isAddPhotosToAlbumModalOpen, setAddPhotosToAlbumModalOpen] =
    useState(false)
  const [
    isDeletePhotosConfirmationModalOpen,
    setDeletePhotosConfirmationModalOpen
  ] = useState(false)
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

  function updateEachDayDimensions(): void {
    if (
      typeof photos !== 'string' &&
      galleryWrapperRef.current !== null &&
      timelineDateDisplayRef.current !== null
    ) {
      const galleryContainerHeight = galleryWrapperRef.current.scrollHeight
      const wrapperHeight = galleryWrapperRef.current.offsetHeight

      timelineDateDisplayRef.current.innerHTML = moment(
        Object.keys(photos.items)[0]
      ).format('MMM D, YYYY')

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

      setReady(true)
      setEachDayDimensions(eachDayHeight)
    }
  }

  return (
    <PhotosContext.Provider
      value={{
        ready,
        photos,
        albumList,
        eachDayDimensions,
        selectedPhotos,
        hidePhotosInAlbum,
        isCreateAlbumModalOpen,
        isAddPhotosToAlbumModalOpen,
        isDeletePhotosConfirmationModalOpen,
        isDragging,
        setReady,
        setSelectedPhotos,
        setHidePhotosInAlbum,
        setCreateAlbumModalOpen,
        setAddPhotosToAlbumModalOpen,
        setDeletePhotosConfirmationModalOpen,
        updateEachDayDimensions,
        refreshAlbumList,
        refreshPhotos,
        sideSliderRef,
        timelineDateDisplayRef,
        mobileDateDisplayRef,
        galleryWrapperRef
      }}
    >
      <Outlet />
    </PhotosContext.Provider>
  )
}

export default Photos
