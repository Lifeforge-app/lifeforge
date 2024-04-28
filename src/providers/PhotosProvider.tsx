/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
import moment from 'moment'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router'
import useFetch from '@hooks/useFetch'
import {
  type IPhotoAlbumTag,
  type IPhotosAlbum,
  type IPhotosEntryDimensions
} from '@typedec/Photos'

const PHOTOS_DATA: {
  ready: boolean
  photos: IPhotosEntryDimensions | 'loading' | 'error'
  albumList: IPhotosAlbum[] | 'loading' | 'error'
  albumTagList: IPhotoAlbumTag[] | 'loading' | 'error'
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
  setPhotoDimensions: React.Dispatch<
    React.SetStateAction<IPhotosEntryDimensions | 'loading' | 'error'>
  >
  setAlbumList: React.Dispatch<
    React.SetStateAction<IPhotosAlbum[] | 'loading' | 'error'>
  >
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
  refreshAlbumTagList: () => void
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
  albumTagList: 'loading',
  eachDayDimensions: {},
  selectedPhotos: [],
  hidePhotosInAlbum: false,
  modifyAlbumModalOpenType: false,
  isAddPhotosToAlbumModalOpen: false,
  isDeletePhotosConfirmationModalOpen: false,
  isRemovePhotosFromAlbumConfirmationModalOpen: false,
  setReady: () => {},
  setPhotoDimensions: () => {},
  setAlbumList: () => {},
  setHidePhotosInAlbum: () => {},
  setSelectedPhotos: () => {},
  setModifyAlbumModalOpenType: () => {},
  setAddPhotosToAlbumModalOpen: () => {},
  setDeletePhotosConfirmationModalOpen: () => {},
  setRemovePhotosFromAlbumConfirmationModalOpen: () => {},
  updateEachDayDimensions: () => {},
  refreshPhotos: () => {},
  refreshAlbumList: () => {},
  refreshAlbumTagList: () => {},
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

  const [photoDimensions, refreshPhotoDimensions, setPhotoDimensions] =
    useFetch<IPhotosEntryDimensions>(
      `photos/entry/dimensions${hidePhotosInAlbum ? '?hideInAlbum=true' : ''}`,
      isBounded
    )

  const [albumList, refreshAlbumList, setAlbumList] = useFetch<IPhotosAlbum[]>(
    'photos/album/list',
    isBounded
  )

  const [albumTagList, refreshAlbumTagList] = useFetch<IPhotoAlbumTag[]>(
    'photos/album/tag/list'
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
        albumTagList,
        eachDayDimensions,
        selectedPhotos,
        hidePhotosInAlbum,
        modifyAlbumModalOpenType,
        isAddPhotosToAlbumModalOpen,
        isDeletePhotosConfirmationModalOpen,
        isRemovePhotosFromAlbumConfirmationModalOpen,
        setReady,
        setPhotoDimensions,
        setAlbumList,
        setSelectedPhotos,
        setHidePhotosInAlbum,
        setModifyAlbumModalOpenType,
        setAddPhotosToAlbumModalOpen,
        setDeletePhotosConfirmationModalOpen,
        setRemovePhotosFromAlbumConfirmationModalOpen,
        updateEachDayDimensions,
        refreshAlbumList,
        refreshAlbumTagList,
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
