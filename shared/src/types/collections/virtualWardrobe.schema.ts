/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: virtualWardrobe
 * Generated at: 2025-07-19T04:32:26.922Z
 * Contains: virtual_wardrobe__entries, virtual_wardrobe__histories
 */

import { z } from "zod/v4";

const Entry = z.object({
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
  is_favourite: z.boolean(),
});

const History = z.object({
  entries: z.array(z.string()),
  notes: z.string(),
});

type IEntry = z.infer<typeof Entry>;
type IHistory = z.infer<typeof History>;

export {
  Entry,
  History,
};

export type {
  IEntry,
  IHistory,
};

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
