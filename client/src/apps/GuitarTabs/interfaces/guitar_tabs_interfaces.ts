import type { RecordModel } from 'pocketbase'

import type { IFormState } from '@lifeforge/ui'

interface IGuitarTabsEntry extends RecordModel {
  name: string
  author: string
  thumbnail: string
  pageCount: number
  pdf: string
  audio: string
  musescore: string
  type: 'fingerstyle' | 'singalong' | ''
  isFavourite: boolean
}

interface IGuitarTabsEntryFormState extends IFormState {
  name: string
  author: string
  type: 'singalong' | 'fingerstyle' | ''
}

interface IGuitarTabsSidebarData {
  total: number
  favourites: number
  categories: {
    fingerstyle: number
    singalong: number
    uncategorized: number
  }
  authors: Record<string, number>
}

interface IGuitarTabsGuitarWorldScoreEntry {
  id: number
  name: string
  subtitle: string
  category: string
  mainArtist: string
  uploader: string
  audioUrl: string
}

interface IGuitarTabsGuitarWorldScores {
  data: IGuitarTabsGuitarWorldScoreEntry[]
  perPage: number
  totalItems: number
}

export type {
  IGuitarTabsEntry,
  IGuitarTabsEntryFormState,
  IGuitarTabsSidebarData,
  IGuitarTabsGuitarWorldScores,
  IGuitarTabsGuitarWorldScoreEntry
}
