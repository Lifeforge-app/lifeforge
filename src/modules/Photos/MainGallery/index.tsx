/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { createContext, useRef, useState } from 'react'
import useFetch from '../../../hooks/useFetch'
import ModuleHeader from '../../../components/general/ModuleHeader'
import GalleryHeader from './Gallery/GalleryHeader'
import GallerySidebar from './Gallery/GallerySidebar'
import GalleryContainer from './Gallery/GalleryContainer'
import CreateAlbumModal from './CreateAlbumModal'
import AddPhotosToAlbumModal from './AddPhotosToAlbumModal'
import moment from 'moment'

export interface IPhotosEntryItem {
  collectionId: string
  collectionName: string
  created: string
  album: string
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

export interface IPhotosAlbum {
  amount: number
  collectionId: string
  collectionName: string
  created: string
  id: string
  name: string
  thumbnail: string
  updated: string
}

const PHOTOS_DATA: {
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
  isCreateAlbumModalOpen: boolean
  isAddPhotosToAlbumModalOpen: boolean
  isDragging: boolean
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>
  setCreateAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAddPhotosToAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
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
  photos: 'loading',
  albumList: 'loading',
  eachDayDimensions: {},
  selectedPhotos: [],
  isCreateAlbumModalOpen: false,
  isAddPhotosToAlbumModalOpen: false,
  isDragging: false,
  setSelectedPhotos: () => {},
  setCreateAlbumModalOpen: () => {},
  setAddPhotosToAlbumModalOpen: () => {},
  setIsDragging: () => {},
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
  const [photos, refreshPhotos] = useFetch<IPhotosEntry>('photos/entry/list')
  const [albumList, refreshAlbumList] =
    useFetch<IPhotosAlbum[]>('photos/album/list')

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [isCreateAlbumModalOpen, setCreateAlbumModalOpen] = useState(false)
  const [isAddPhotosToAlbumModalOpen, setAddPhotosToAlbumModalOpen] =
    useState(false)
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

      setEachDayDimensions(eachDayHeight)
    }
  }

  return (
    <PhotosContext.Provider
      value={{
        photos,
        albumList,
        eachDayDimensions,
        selectedPhotos,
        isCreateAlbumModalOpen,
        isAddPhotosToAlbumModalOpen,
        isDragging,
        setSelectedPhotos,
        setCreateAlbumModalOpen,
        setAddPhotosToAlbumModalOpen,
        setIsDragging,
        updateEachDayDimensions,
        refreshAlbumList,
        refreshPhotos,
        sideSliderRef,
        timelineDateDisplayRef,
        mobileDateDisplayRef,
        galleryWrapperRef
      }}
    >
      <section className="relative flex h-full min-h-0 w-full flex-1 flex-col pl-4 sm:pl-12">
        <ModuleHeader
          title="Photos"
          desc="View and manage all your precious memories."
        />
        <GalleryHeader />
        <div className="relative flex h-full min-h-0 w-full gap-8">
          <GallerySidebar />
          <GalleryContainer />
        </div>
        <CreateAlbumModal />
        <AddPhotosToAlbumModal />
      </section>
    </PhotosContext.Provider>
  )
}

export default Photos
