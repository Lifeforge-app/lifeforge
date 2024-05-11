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

interface IPhotosAlbum {
  amount: number
  is_public: boolean
  collectionId: string
  collectionName: string
  created: string
  id: string
  name: string
  cover: string
  tags: string[]
  updated: string
}

export interface IPhotoAlbumEntryItem extends IPhotosEntryDimensionsItem {
  collectionId: string
  photoId: string
  image: string
  has_raw: boolean
  is_in_album: boolean
  is_favourite: boolean
}

export interface IPhotoAlbumTag {
  collectionId: string
  collectionName: string
  created: Date
  id: string
  name: string
  updated: Date
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
