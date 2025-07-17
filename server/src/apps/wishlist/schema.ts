/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: wishlist
 * Generated at: 2025-07-09T12:50:41.285Z
 * Contains: wishlist__lists, wishlist__entries, wishlist__lists_aggregated
 */
import { z } from "zod/v4";

const WishlistListSchema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  icon: z.string(),
});

const WishlistEntrySchema = z.object({
  name: z.string(),
  url: z.string(),
  price: z.number(),
  image: z.string(),
  list: z.string(),
  bought: z.boolean(),
  bought_at: z.string(),
});

const WishlistListAggregatedSchema = z.object({
  name: z.string(),
  description: z.string(),
  color: z.string(),
  icon: z.string(),
  total_count: z.number(),
  total_amount: z.any(),
  bought_count: z.number(),
  bought_amount: z.any(),
});

type IWishlistList = z.infer<typeof WishlistListSchema>;
type IWishlistEntry = z.infer<typeof WishlistEntrySchema>;
type IWishlistListAggregated = z.infer<typeof WishlistListAggregatedSchema>;

export {
  WishlistListSchema,
  WishlistEntrySchema,
  WishlistListAggregatedSchema,
};

export type { IWishlistList, IWishlistEntry, IWishlistListAggregated };

// -------------------- CUSTOM SCHEMAS --------------------

// Add your custom schemas here. They will not be overwritten by this script.
