/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Outlet } from 'react-router'
import useFetch from '@hooks/useFetch'
import {
  type IPhotosEntryDimensionsPagination,
  type IPhotoAlbumTag,
  type IPhotosAlbum,
  type IPhotosEntryDimensionsAll
} from '@interfaces/photos_interfaces'
import IntervalManager from '@utils/intervalManager'
import { useAuthContext } from './AuthProvider'
import { useGlobalStateContext } from './GlobalStateProvider'

const intervalManager = IntervalManager.getInstance()

interface IPhotosData {
  // State variables
  useTimelineScrollbar: boolean
  ready: boolean
  hidePhotosInAlbum: boolean
  isAddPhotosToAlbumModalOpen: boolean
  isDeletePhotosConfirmationModalOpen: boolean
  isRemovePhotosFromAlbumConfirmationModalOpen: boolean
  modifyAlbumModalOpenType: 'create' | 'rename' | false

  // Data
  photos:
    | IPhotosEntryDimensionsAll
    | IPhotosEntryDimensionsPagination
    | 'loading'
    | 'error'
  albumList: IPhotosAlbum[] | 'loading' | 'error'
  albumTagList: IPhotoAlbumTag[] | 'loading' | 'error'
  eachDayDimensions: Record<string, { inTimeline: number; inGallery: number }>
  selectedPhotos: string[]
  sidebarOpen: boolean

  // State setters
  setReady: React.Dispatch<React.SetStateAction<boolean>>
  setPhotoDimensions: React.Dispatch<
    React.SetStateAction<
      | IPhotosEntryDimensionsAll
      | IPhotosEntryDimensionsPagination
      | 'loading'
      | 'error'
    >
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
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>

  // Actions
  updateEachDayDimensions: () => void
  refreshAlbumList: () => void
  refreshAlbumTagList: () => void
  refreshPhotos: () => void

  // Refs
  sideSliderRef: React.RefObject<HTMLDivElement | null> | { current: null }
  timelineDateDisplayRef:
    | React.RefObject<HTMLDivElement | null>
    | { current: null }
  mobileDateDisplayRef:
    | React.RefObject<HTMLDivElement | null>
    | { current: null }
  galleryWrapperRef: React.RefObject<HTMLDivElement | null> | { current: null }
}

export const PhotosContext = createContext<IPhotosData | undefined>(undefined)

export default function PhotosProvider(): React.ReactElement {
  const { setSubSidebarExpanded } = useGlobalStateContext()
  const { userData } = useAuthContext()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [useTimelineScrollbar] = useState(
    userData?.moduleConfigs.Photos.useTimelineScrollbar ?? false
  )
  const [ready, setReady] = useState(!useTimelineScrollbar)
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
  const isPhotoLoading = useRef(false)

  const [photoDimensions, setPhotoDimensions] = useState<
    | IPhotosEntryDimensionsAll
    | IPhotosEntryDimensionsPagination
    | 'loading'
    | 'error'
  >('loading')

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

  async function fetchPhotoDimensionsData(): Promise<IPhotosEntryDimensionsAll | null> {
    const data = await fetch(
      `${import.meta.env.VITE_API_HOST}/photos/entries/dimensions/async-res`,
      {
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        if (response.status !== 200) return null

        const data = await response.json()
        if (data.state !== 'success') return null

        return data.data
      })
      .catch(() => null)

    return data
  }

  function refreshPhotoDimensions(): void {
    setPhotoDimensions('loading')
    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/entries/dimensions/async-get${
        hidePhotosInAlbum ? '?hideInAlbum=true' : ''
      }`,
      {
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        if (response.status === 202) {
          const data = await response.json()
          if (data.state === 'accepted') {
            intervalManager.setInterval(async () => {
              const data = await fetchPhotoDimensionsData()
              if (data === null) return

              data.items = data.items.map(([day, photos]) => [
                day,
                photos.sort((a, b) =>
                  moment(b.shot_time).diff(moment(a.shot_time))
                )
              ])
              setPhotoDimensions(data)
              isPhotoLoading.current = false
              intervalManager.clearAllIntervals()
            }, 3000)
          }
        } else {
          setPhotoDimensions('error')
        }
      })
      .catch(() => {
        setPhotoDimensions('error')
      })
  }

  useEffect(() => {
    if (!isPhotoLoading.current) {
      isPhotoLoading.current = true
      refreshPhotoDimensions()
    }
  }, [hidePhotosInAlbum, isBounded])

  useEffect(() => {
    setSubSidebarExpanded(sidebarOpen)
  }, [sidebarOpen])

  return (
    <PhotosContext
      value={{
        // State variables
        useTimelineScrollbar,
        ready,
        hidePhotosInAlbum,
        isAddPhotosToAlbumModalOpen,
        isDeletePhotosConfirmationModalOpen,
        isRemovePhotosFromAlbumConfirmationModalOpen,
        modifyAlbumModalOpenType,

        // Data
        photos: photoDimensions,
        albumList,
        albumTagList,
        eachDayDimensions,
        selectedPhotos,
        sidebarOpen,

        // State setters
        setReady,
        setPhotoDimensions,
        setAlbumList,
        setSelectedPhotos,
        setHidePhotosInAlbum,
        setModifyAlbumModalOpenType,
        setAddPhotosToAlbumModalOpen,
        setDeletePhotosConfirmationModalOpen,
        setRemovePhotosFromAlbumConfirmationModalOpen,
        setSidebarOpen,

        // Actions
        updateEachDayDimensions,
        refreshAlbumList,
        refreshAlbumTagList,
        refreshPhotos: _refreshPhotos,

        // Refs
        sideSliderRef,
        timelineDateDisplayRef,
        mobileDateDisplayRef,
        galleryWrapperRef
      }}
    >
      <Outlet />
    </PhotosContext>
  )
}

export function usePhotosContext(): IPhotosData {
  const context = useContext(PhotosContext)
  if (context === undefined) {
    throw new Error('usePhotosContext must be used within a PhotosProvider')
  }
  return context
}
