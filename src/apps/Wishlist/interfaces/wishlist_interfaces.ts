import type { RecordModel } from 'pocketbase'

interface IWishlistList extends RecordModel {
  name: string
  description: string
  icon: string
  color: string
  item_count: number
  total_amount: number
  bought_count: number
}

interface IWishlistEntry extends RecordModel {
  name: string
  url: string
  price: number
  image: string
  list: string
  bought: boolean
  bought_at: string
}

export type { IWishlistList, IWishlistEntry }
