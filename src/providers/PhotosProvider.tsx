/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
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
} from '@typedec/Photos'
import { AuthContext } from './AuthProvider'

class IntervalManager {
  private static instance: IntervalManager
  private readonly intervals: Set<NodeJS.Timeout>

  private constructor() {
    this.intervals = new Set<NodeJS.Timeout>()
  }

  public static getInstance(): IntervalManager {
    if (!IntervalManager.instance) {
      IntervalManager.instance = new IntervalManager()
    }

    return IntervalManager.instance
  }

  public setInterval(callback: () => void, delay: number): NodeJS.Timeout {
    const id = setInterval(callback, delay)
    this.intervals.add(id)
    return id
  }

  public clearInterval(id: NodeJS.Timeout): void {
    clearInterval(id)
    this.intervals.delete(id)
  }

  public clearAllIntervals(): void {
    for (const id of this.intervals) {
      clearInterval(id)
    }
    this.intervals.clear()
  }
}

const intervalManager = IntervalManager.getInstance()

const PHOTOS_DATA: {
  useTimelineScrollbar: boolean
  ready: boolean
  photos:
    | IPhotosEntryDimensionsAll
    | IPhotosEntryDimensionsPagination
    | 'loading'
    | 'error'
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
  useTimelineScrollbar: false,
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
  const { userData } = useContext(AuthContext)

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
      `${import.meta.env.VITE_API_HOST}/photos/entry/dimensions/async-res`,
      {
        headers: {
          Authorization: `Bearer ${cookieParse(document.cookie).token}`
        }
      }
    )
      .then(async response => {
        if (response.status === 200) {
          const data = await response.json()
          if (data.state === 'success') {
            return data.data
          } else {
            return null
          }
        }
        return null
      })
      .catch(() => null)

    return data
  }

  function refreshPhotoDimensions(): void {
    setPhotoDimensions('loading')
    fetch(
      `${import.meta.env.VITE_API_HOST}/photos/entry/dimensions/async-get${
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
              if (data !== null) {
                data.items = data.items.map(([day, photos]) => [
                  day,
                  photos.sort((a, b) =>
                    moment(b.shot_time).diff(moment(a.shot_time))
                  )
                ])
                setPhotoDimensions(data)
                isPhotoLoading.current = false
                intervalManager.clearAllIntervals()
              }
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

  return (
    <PhotosContext.Provider
      value={{
        useTimelineScrollbar,
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
