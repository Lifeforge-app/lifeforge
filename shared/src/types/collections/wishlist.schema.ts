/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: wishlist
 * Generated at: 2025-07-19T08:49:31.513Z
 * Contains: wishlist__lists, wishlist__entries, wishlist__lists_aggregated
 */
import { z } from 'zod/v4'

const List = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  icon: z.string()
})

const Entry = z.object({
  name: z.string(),
  url: z.string(),
  price: z.number(),
  image: z.string(),
  list: z.string(),
  bought: z.boolean(),
  bought_at: z.string()
})

const ListAggregated = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  icon: z.string(),
  total_count: z.number(),
  total_amount: z.any(),
  bought_count: z.number(),
  bought_amount: z.any()
})

type IList = z.infer<typeof List>
type IEntry = z.infer<typeof Entry>
type IListAggregated = z.infer<typeof ListAggregated>

export { List, Entry, ListAggregated }

export type { IList, IEntry, IListAggregated }

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
