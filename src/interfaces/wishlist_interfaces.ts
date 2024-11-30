import type BasePBCollection from './pocketbase_interfaces'

interface IWishlistList extends BasePBCollection {
  name: string
  description: string
  icon: string
  color: string
  item_count: number
}

export type { IWishlistList }
