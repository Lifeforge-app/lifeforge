interface IPhotosEntryDimensionsItem {
  is_in_album: boolean
  is_deleted: string
  id: string
  shot_time: string
  width: number
  height: number
}

interface IPhotosEntryDimensions {
  totalItems: number
  items: Array<[string, IPhotosEntryDimensionsItem[]]>
  firstDayOfYear: Record<string, string>
  firstDayOfMonth: Record<string, string>
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

export type {
  IPhotosEntryDimensionsItem,
  IPhotosEntryDimensions,
  IPhotosEntry,
  IPhotosAlbum,
  IPhotoAlbumEntryItem
}
