import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";
import { WishlistCollectionsSchemas } from "../collections";
import type { InferApiESchemaDynamic } from "../utils/inferSchema";

const Entries = {
  /**
   * @route       GET /collection-id
   * @description Get wishlist entries collection ID
   */
  getCollectionId: {
    response: z.string(),
  },

  /**
   * @route       GET /:id
   * @description Get wishlist entries by list ID
   */
  getEntriesByListId: {
    params: z.object({
      id: z.string(),
    }),
    query: z.object({
      bought: z
        .string()
        .optional()
        .transform((val) => val === "true"),
    }),
    response: z.array(SchemaWithPB(WishlistCollectionsSchemas.Entry)),
  },

  /**
   * @route       POST /external
   * @description Scrape external website for wishlist entry data
   */
  scrapeExternal: {
    body: z.object({
      url: z.string(),
      provider: z.string(),
    }),
    response: z.any(),
  },

  /**
   * @route       POST /
   * @description Create a new wishlist entry
   */
  createEntry: {
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform((val) => parseFloat(val) || 0 || 0),
      list: z.string(),
      image: z.any().optional(),
    }),
    response: SchemaWithPB(WishlistCollectionsSchemas.Entry),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing wishlist entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: z.object({
      name: z.string(),
      url: z.string(),
      price: z.string().transform((val) => parseFloat(val) || 0 || 0),
      list: z.string(),
      imageRemoved: z.string().optional(),
    }),
    response: z.union([
      SchemaWithPB(WishlistCollectionsSchemas.Entry),
      z.literal("removed"),
    ]),
  },

  /**
   * @route       PATCH /bought/:id
   * @description Update wishlist entry bought status
   */
  updateEntryBoughtStatus: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(WishlistCollectionsSchemas.Entry),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a wishlist entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

const Lists = {
  /**
   * @route       GET /:id
   * @description Get wishlist by ID
   */
  getList: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(WishlistCollectionsSchemas.ListAggregated),
  },

  /**
   * @route       GET /valid/:id
   * @description Check if wishlist exists
   */
  checkListExists: {
    params: z.object({
      id: z.string(),
    }),
    response: z.boolean(),
  },

  /**
   * @route       GET /
   * @description Get all wishlists with statistics
   */
  getAllLists: {
    response: z.array(SchemaWithPB(WishlistCollectionsSchemas.ListAggregated)),
  },

  /**
   * @route       POST /
   * @description Create a new wishlist
   */
  createList: {
    body: WishlistCollectionsSchemas.List,
    response: SchemaWithPB(WishlistCollectionsSchemas.List),
  },

  /**
   * @route       PATCH /:id
   * @description Update an existing wishlist
   */
  updateList: {
    params: z.object({
      id: z.string(),
    }),
    body: WishlistCollectionsSchemas.List,
    response: SchemaWithPB(WishlistCollectionsSchemas.List),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a wishlist
   */
  deleteList: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },
};

type IEntries = InferApiESchemaDynamic<typeof Entries>;
type ILists = InferApiESchemaDynamic<typeof Lists>;

export type { IEntries, ILists };

export { Entries, Lists };
