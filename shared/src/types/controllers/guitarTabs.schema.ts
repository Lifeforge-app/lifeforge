import { z } from "zod/v4";
import { SchemaWithPB } from "../collections/schemaWithPB";

const GuitarWorld = {
  /**
   * @route       POST /
   * @description Get tabs list from Guitar World
   */
  getTabsList: {
    body: z.object({
      cookie: z.string(),
      page: z.number().optional().default(1),
    }),
    response: z.object({
      data: z.array(GuitarTabsSchemas.GuitarTabsGuitarWorldEntrySchema),
      totalItems: z.number(),
      perPage: z.number(),
    }),
  },

  /**
   * @route       POST /download
   * @description Download a guitar tab from Guitar World
   */
  downloadTab: {
    body: z.object({
      cookie: z.string(),
      id: z.number(),
      name: z.string(),
      category: z.string(),
      mainArtist: z.string(),
      audioUrl: z.string(),
    }),
    response: z.string(),
  },
};

const Entries = {
  /**
   * @route       GET /sidebar-data
   * @description Get sidebar data for guitar tabs
   */
  getSidebarData: {
    response: GuitarTabsSchemas.GuitarTabsSidebarDataSchema,
  },

  /**
   * @route       GET /
   * @description Get guitar tabs entries
   */
  getEntries: {
    query: z.object({
      page: z
        .string()
        .optional()
        .transform((val) => parseInt(val ?? "1", 10) || 1),
      query: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
      starred: z
        .string()
        .optional()
        .transform((val) => val === "true"),
      sort: z
        .enum(["name", "author", "newest", "oldest"])
        .optional()
        .default("newest"),
    }),
    response: PBListResultSchema(SchemaWithPB(GuitarTabsSchemas.EntrySchema)),
  },

  /**
   * @route       GET /random
   * @description Get a random guitar tab entry
   */
  getRandomEntry: {
    response: SchemaWithPB(GuitarTabsSchemas.EntrySchema),
  },

  /**
   * @route       POST /upload
   * @description Upload guitar tab files
   */
  uploadFiles: {
    response: z.string(),
  },

  /**
   * @route       PATCH /:id
   * @description Update a guitar tab entry
   */
  updateEntry: {
    params: z.object({
      id: z.string(),
    }),
    body: GuitarTabsSchemas.EntrySchema.pick({
      name: true,
      author: true,
      type: true,
    }),
    response: SchemaWithPB(GuitarTabsSchemas.EntrySchema),
  },

  /**
   * @route       DELETE /:id
   * @description Delete a guitar tab entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string(),
    }),
    response: z.void(),
  },

  /**
   * @route       POST /favourite/:id
   * @description Toggle favorite status of a guitar tab entry
   */
  toggleFavorite: {
    params: z.object({
      id: z.string(),
    }),
    response: SchemaWithPB(GuitarTabsSchemas.EntrySchema),
  },
};

type IGuitarWorld = z.infer<typeof GuitarWorld>;
type IEntries = z.infer<typeof Entries>;

export type { IGuitarWorld, IEntries };
export { GuitarWorld, Entries };
