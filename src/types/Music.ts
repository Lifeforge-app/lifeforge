import type BasePBCollection from './Pocketbase'

interface IMusicEntry extends BasePBCollection {
  name: string
  author: string
  duration: string
  file: string
  is_favourite: boolean
}

export type { IMusicEntry }
