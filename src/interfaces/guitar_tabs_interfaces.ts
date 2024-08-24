import type BasePBCollection from './pocketbase_interfaces.js'

interface IGuitarTabsEntry extends BasePBCollection {
  name: string
  author: string
  thumbnail: string
  pageCount: number
  pdf: string
  audio: string
  musescore: string
}

export default IGuitarTabsEntry
