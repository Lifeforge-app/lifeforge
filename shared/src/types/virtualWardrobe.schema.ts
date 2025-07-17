/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: virtualWardrobe
 * Generated at: 2025-07-17T08:55:29.691Z
 * Contains: virtual_wardrobe__entries, virtual_wardrobe__histories
 */
import { z } from 'zod/v4'

const EntrySchema = z.object({
  name: z.string(),
  category: z.string(),
  subcategory: z.string(),
  colors: z.any(),
  size: z.string(),
  brand: z.string(),
  front_image: z.string(),
  back_image: z.string(),
  last_worn: z.string(),
  times_worn: z.number(),
  purchase_date: z.string(),
  price: z.number(),
  notes: z.string(),
  is_favourite: z.boolean()
})

const HistorySchema = z.object({
  entries: z.array(z.string()),
  notes: z.string()
})

type IEntry = z.infer<typeof EntrySchema>
type IHistory = z.infer<typeof HistorySchema>

export { EntrySchema, HistorySchema }

export type { IEntry, IHistory }

// -------------------- CUSTOM SCHEMAS --------------------

const VirtualWardrobeSidebarDataSchema = z.object({
  total: z.number(),
  favourites: z.number(),
  categories: z.record(z.string(), z.number()),
  subcategories: z.record(z.string(), z.number()),
  brands: z.record(z.string(), z.number()),
  sizes: z.record(z.string(), z.number()),
  colors: z.record(z.string(), z.number())
})

type IVirtualWardrobeSidebarData = z.infer<
  typeof VirtualWardrobeSidebarDataSchema
>

export { VirtualWardrobeSidebarDataSchema }

export type { IVirtualWardrobeSidebarData }
