import type BasePBCollection from './Pocketbase'

interface IPhotosEntryDimensionsItem {
  is_in_album: boolean
  is_deleted: string
  id: string
  shot_time: string
  width: number
  height: number
}

interface IPhotosEntryDimensionsAll {
  totalItems: number
  items: Array<[string, IPhotosEntryDimensionsItem[]]>
  firstDayOfYear: Record<string, string>
  firstDayOfMonth: Record<string, string>
  collectionId: string
}

interface IPhotosEntryDimensionsPagination {
  totalItems: number
  items: Array<[string, IPhotosEntryDimensionsItem[]]>
  collectionId: string
}

interface IPhotosEntry {
  id: string
  image: string
  has_raw: boolean
  is_in_album: boolean
  is_favourite: boolean
}

interface IPhotosAlbum extends BasePBCollection {
  amount: number
  is_public: boolean
  name: string
  cover: string
  tags: string[]
}

interface IPhotoAlbumEntryItem extends IPhotosEntryDimensionsItem {
  collectionId: string
  photoId: string
  image: string
  has_raw: boolean
  is_in_album: boolean
  is_favourite: boolean
}

interface IPhotoAlbumTag extends BasePBCollection {
  name: string
  count: number
}

export type {
  IPhotosEntryDimensionsItem,
  IPhotosEntryDimensionsAll,
  IPhotosEntryDimensionsPagination,
  IPhotosEntry,
  IPhotosAlbum,
  IPhotoAlbumTag,
  IPhotoAlbumEntryItem
}
