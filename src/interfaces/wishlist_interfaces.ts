import type BasePBCollection from './pocketbase_interfaces'

interface IWishlistList extends BasePBCollection {
  name: string
  description: string
  icon: string
  color: string
  item_count: number
}

interface IWishlistEntry extends BasePBCollection {
  name: string
  url: string
  price: number
  image: string
  list: IWishlistList
}

export type { IWishlistList, IWishlistEntry }
