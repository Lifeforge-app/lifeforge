import type { FormState } from 'lifeforge-ui'
import type { RecordModel } from 'pocketbase'

interface IVirtualWardrobeSidebarData {
  total: number
  favourites: number
  categories: Record<string, number>
  subcategories: Record<string, number>
  brands: Record<string, number>
  sizes: Record<string, number>
  colors: Record<string, number>
}

interface IVirtualWardrobeEntry extends RecordModel {
  name: string
  category: string
  subcategory: string
  brand: string
  size: string
  colors: string[]
  price: number
  notes: string
  times_worn: number
  last_worn: string
  front_image: string
  back_image: string
}

interface IVirtualWardrobeFormState extends FormState {
  name: string
  category: string
  subcategory: string
  brand: string
  size: string
  colors: string[]
  price: number
  notes: string
}

export type {
  IVirtualWardrobeEntry,
  IVirtualWardrobeSidebarData,
  IVirtualWardrobeFormState
}
