/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
import moment from 'moment'
import React, { createContext, useEffect, useRef, useState } from 'react'
import useFetch from '@hooks/useFetch'
import { Outlet } from 'react-router'

export interface IPhotosEntryDimensionsItem {
  is_in_album: boolean
  is_deleted: string
  id: string
  shot_time: string
  width: number
  height: number
}

export interface IPhotosEntryDimensions {
  totalItems: number
  items: Array<[string, IPhotosEntryDimensionsItem[]]>
  firstDayOfYear: Record<string, string>
  firstDayOfMonth: Record<string, string>
  collectionId: string
}

export interface IPhotosEntry {
  id: string
  image: string
  has_raw: boolean
  is_in_album: boolean
  is_favourite: boolean
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
  photos: IPhotosEntryDimensions | 'loading' | 'error'
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
  modifyAlbumModalOpenType: 'create' | 'rename' | false
  isAddPhotosToAlbumModalOpen: boolean
  isDeletePhotosConfirmationModalOpen: boolean
  isRemovePhotosFromAlbumConfirmationModalOpen: boolean
  setReady: React.Dispatch<React.SetStateAction<boolean>>
  setHidePhotosInAlbum: React.Dispatch<React.SetStateAction<boolean>>
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>
  setModifyAlbumModalOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'rename' | false>
  >
  setAddPhotosToAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDeletePhotosConfirmationModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >
  setRemovePhotosFromAlbumConfirmationModalOpen: React.Dispatch<
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
  modifyAlbumModalOpenType: false,
  isAddPhotosToAlbumModalOpen: false,
  isDeletePhotosConfirmationModalOpen: false,
  isRemovePhotosFromAlbumConfirmationModalOpen: false,
  setReady: () => {},
  setHidePhotosInAlbum: () => {},
  setSelectedPhotos: () => {},
  setModifyAlbumModalOpenType: () => {},
  setAddPhotosToAlbumModalOpen: () => {},
  setDeletePhotosConfirmationModalOpen: () => {},
  setRemovePhotosFromAlbumConfirmationModalOpen: () => {},
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
  const [albumList, refreshAlbumList] =
    useFetch<IPhotosAlbum[]>('photos/album/list')

  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [modifyAlbumModalOpenType, setModifyAlbumModalOpenType] = useState<
    'create' | 'rename' | false
  >(false)
  const [isAddPhotosToAlbumModalOpen, setAddPhotosToAlbumModalOpen] =
    useState(false)
  const [
    isDeletePhotosConfirmationModalOpen,
    setDeletePhotosConfirmationModalOpen
  ] = useState(false)
  const [
    isRemovePhotosFromAlbumConfirmationModalOpen,
    setRemovePhotosFromAlbumConfirmationModalOpen
  ] = useState(false)

  const sideSliderRef = useRef<HTMLDivElement>(null)
  const timelineDateDisplayRef = useRef<HTMLDivElement>(null)
  const mobileDateDisplayRef = useRef<HTMLDivElement>(null)
  const galleryWrapperRef = useRef<HTMLDivElement>(null)
  const [isBounded, setIsBounded] = useState(false)

  const [photoDimensions, refreshPhotoDimensions] =
    useFetch<IPhotosEntryDimensions>(
      `photos/entry/dimensions${hidePhotosInAlbum ? '?hideInAlbum=true' : ''}`,
      isBounded
    )

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
      typeof photoDimensions !== 'string' &&
      galleryWrapperRef.current !== null &&
      timelineDateDisplayRef.current !== null
    ) {
      const galleryContainerHeight = galleryWrapperRef.current.scrollHeight
      const wrapperHeight = galleryWrapperRef.current.offsetHeight

      timelineDateDisplayRef.current.innerHTML = moment(
        photoDimensions.items[0][0]
      ).format('MMM D, YYYY')

      const eachDayHeight: Record<
        string,
        {
          inTimeline: number
          inGallery: number
        }
      > = {}

      for (const [day] of photoDimensions.items) {
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

  function _refreshPhotos(): void {
    setReady(false)
    refreshPhotoDimensions()
  }

  useEffect(() => {
    setIsBounded(true)
  }, [])

  return (
    <PhotosContext.Provider
      value={{
        ready,
        photos: photoDimensions,
        albumList,
        eachDayDimensions,
        selectedPhotos,
        hidePhotosInAlbum,
        modifyAlbumModalOpenType,
        isAddPhotosToAlbumModalOpen,
        isDeletePhotosConfirmationModalOpen,
        isRemovePhotosFromAlbumConfirmationModalOpen,
        setReady,
        setSelectedPhotos,
        setHidePhotosInAlbum,
        setModifyAlbumModalOpenType,
        setAddPhotosToAlbumModalOpen,
        setDeletePhotosConfirmationModalOpen,
        setRemovePhotosFromAlbumConfirmationModalOpen,
        updateEachDayDimensions,
        refreshAlbumList,
        refreshPhotos: _refreshPhotos,
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
