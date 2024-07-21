import type BasePBCollection from './pocketbase_interfaces'

interface IGuitarTabsEntry extends BasePBCollection {
  name: string
  author: string
  file: string
  thumbnail: string
  pageCount: number
}

export default IGuitarTabsEntry
