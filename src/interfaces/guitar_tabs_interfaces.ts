import type BasePBCollection from './pocketbase_interfaces.js'

interface IGuitarTabsEntry extends BasePBCollection {
  name: string
  author: string
  thumbnail: string
  pageCount: number
  pdf: string
  audio: string
  musescore: string
  type: 'fingerstyle' | 'singalong'
  isFavourite: boolean
}

interface IGuitarTabsSidebarData {
  total: number
  favourites: number
  fingerstyle: number
  singalong: number
  authors: Record<string, number>
}

export type { IGuitarTabsEntry, IGuitarTabsSidebarData }
