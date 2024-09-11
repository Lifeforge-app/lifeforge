import type BasePBCollection from './pocketbase_interfaces'

export interface IYoutubeVideoInfo {
  title: string
  uploadDate: string
  uploader: string
  duration: string
  viewCount: number
  likeCount: number
  thumbnail: string
}

interface IYoutubeVideosStorageEntry extends BasePBCollection {
  youtube_id: string
  title: string
  upload_date: string
  uploader: string
  duration: number
  width: number
  height: number
  filesize: number
}

interface IYoutubePlaylistVideoEntry {
  id: string
  title: string
  duration: number
  uploader: string
  thumbnail: string
  viewCount: number
}

interface IYoutubePlaylistEntry {
  title: string
  total_videos: number
  thumbnail: string
  views: number
  channel: string
  entries: IYoutubePlaylistVideoEntry[]
}

export type {
  IYoutubeVideoInfo,
  IYoutubeVideosStorageEntry,
  IYoutubePlaylistEntry,
  IYoutubePlaylistVideoEntry
}
