import type BasePBCollection from './pocketbase_interfaces'

interface IYoutubeVideosStorageEntry extends BasePBCollection {
  youtube_id: string
  title: string
  upload_date: string
  uploader: string
  duration: number
}

export type { IYoutubeVideosStorageEntry }
