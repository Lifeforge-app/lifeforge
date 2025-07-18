/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: wishlist
 * Generated at: 2025-07-18T00:32:55.276Z
 * Contains: wishlist__lists, wishlist__entries, wishlist__lists_aggregated
 */

import { z } from "zod/v4";
const ListSchema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  icon: z.string(),
});

const EntrySchema = z.object({
  name: z.string(),
  url: z.string(),
  price: z.number(),
  image: z.string(),
  list: z.string(),
  bought: z.boolean(),
  bought_at: z.string(),
});

const ListAggregatedSchema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  icon: z.string(),
  total_count: z.number(),
  total_amount: z.any(),
  bought_count: z.number(),
  bought_amount: z.any(),
});

type IList = z.infer<typeof ListSchema>;
type IEntry = z.infer<typeof EntrySchema>;
type IListAggregated = z.infer<typeof ListAggregatedSchema>;

export {
  ListSchema,
  EntrySchema,
  ListAggregatedSchema,
};

export type {
  IList,
  IEntry,
  IListAggregated,
};

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
