/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable multiline-ternary */
import React, { createContext, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import ModuleHeader from '../../components/general/ModuleHeader'
import GalleryHeader from './Gallery/GalleryHeader'
import GallerySidebar from './Gallery/GallerySidebar'
import GalleryContainer from './Gallery/GalleryContainer'
import CreateAlbumModal from './CreateAlbumModal'
import AddPhotosToAlbumModal from './AddPhotosToAlbumModal'

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
  selectedPhotos: string[]
  isCreateAlbumModalOpen: boolean
  isAddPhotosToAlbumModalOpen: boolean
  setSelectedPhotos: React.Dispatch<React.SetStateAction<string[]>>
  setCreateAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setAddPhotosToAlbumModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  refreshAlbumList: () => void
} = {
  photos: 'loading',
  albumList: 'loading',
  selectedPhotos: [],
  isCreateAlbumModalOpen: false,
  isAddPhotosToAlbumModalOpen: false,
  setSelectedPhotos: () => {},
  setCreateAlbumModalOpen: () => {},
  setAddPhotosToAlbumModalOpen: () => {},
  refreshAlbumList: () => {}
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

  return (
    <PhotosContext.Provider
      value={{
        photos,
        albumList,
        selectedPhotos,
        isCreateAlbumModalOpen,
        isAddPhotosToAlbumModalOpen,
        setSelectedPhotos,
        setCreateAlbumModalOpen,
        setAddPhotosToAlbumModalOpen,
        refreshAlbumList
      }}
    >
      <section className="relative flex h-full min-h-0 w-full flex-1 flex-col pl-4 sm:pl-12">
        <ModuleHeader
          title="Photos"
          desc="View and manage all your precious memories."
        />
        <GalleryHeader photos={photos} refreshPhotos={refreshPhotos} />
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
