import { z } from 'zod/v4'

import { ScoresLibraryCollectionsSchemas } from '../collections'
import { SchemaWithPB } from '../collections/schemaWithPB'
import type { InferApiESchemaDynamic } from '../utils/inferSchema'

const GuitarWorld = {
  /**
   * @route       GET /
   * @description Get tabs list from Guitar World
   */
  getTabsList: {
    query: z.object({
      cookie: z.string(),
      page: z
        .string()
        .optional()
        .transform(val => parseInt(val ?? '1', 10) || 1)
    }),
    response: z.object({
      data: z.array(ScoresLibraryCollectionsSchemas.GuitarWorldEntry),
      totalItems: z.number(),
      perPage: z.number()
    })
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
      audioUrl: z.string()
    }),
    response: z.string()
  }
}

const Entries = {
  /**
   * @route       GET /sidebar-data
   * @description Get sidebar data for guitar tabs
   */
  getSidebarData: {
    response: ScoresLibraryCollectionsSchemas.SidebarData
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
        .transform(val => parseInt(val ?? '1', 10) || 1),
      query: z.string().optional(),
      category: z.string().optional(),
      author: z.string().optional(),
      starred: z
        .string()
        .optional()
        .transform(val => val === 'true'),
      sort: z
        .enum(['name', 'author', 'newest', 'oldest'])
        .optional()
        .default('newest')
    }),
    response: z.object({
      items: z.array(SchemaWithPB(ScoresLibraryCollectionsSchemas.Entry)),
      page: z.number(),
      perPage: z.number(),
      totalItems: z.number(),
      totalPages: z.number()
    })
  },

  /**
   * @route       GET /random
   * @description Get a random guitar tab entry
   */
  getRandomEntry: {
    response: SchemaWithPB(ScoresLibraryCollectionsSchemas.Entry)
  },

  /**
   * @route       POST /upload
   * @description Upload guitar tab files
   */
  uploadFiles: {
    response: z.string()
  },

  /**
   * @route       PATCH /:id
   * @description Update a guitar tab entry
   */
  updateEntry: {
    params: z.object({
      id: z.string()
    }),
    body: ScoresLibraryCollectionsSchemas.Entry.pick({
      name: true,
      author: true,
      type: true
    }),
    response: SchemaWithPB(ScoresLibraryCollectionsSchemas.Entry)
  },

  /**
   * @route       DELETE /:id
   * @description Delete a guitar tab entry
   */
  deleteEntry: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  },

  /**
   * @route       POST /favourite/:id
   * @description Toggle favorite status of a guitar tab entry
   */
  toggleFavourite: {
    params: z.object({
      id: z.string()
    }),
    response: SchemaWithPB(ScoresLibraryCollectionsSchemas.Entry)
  }
}

const Types = {
  /**
   * @route       GET /types
   * @description Get all guitar tab types
   */
  getTypes: {
    response: z.array(
      SchemaWithPB(ScoresLibraryCollectionsSchemas.TypeAggregated)
    )
  },

  /**
   * @route       POST /types
   * @description Create a new guitar tab type
   */
  createType: {
    body: ScoresLibraryCollectionsSchemas.Type,
    response: SchemaWithPB(ScoresLibraryCollectionsSchemas.Type)
  },

  /**
   * @route       PATCH /types/:id
   * @description Update an existing guitar tab type
   */
  updateType: {
    params: z.object({
      id: z.string()
    }),
    body: ScoresLibraryCollectionsSchemas.Type,
    response: SchemaWithPB(ScoresLibraryCollectionsSchemas.Type)
  },

  /**
   * @route       DELETE /types/:id
   * @description Delete a guitar tab type
   */
  deleteType: {
    params: z.object({
      id: z.string()
    }),
    response: z.void()
  }
}

type IGuitarWorld = InferApiESchemaDynamic<typeof GuitarWorld>
type IEntries = InferApiESchemaDynamic<typeof Entries>
type ITypes = InferApiESchemaDynamic<typeof Types>

export type { IGuitarWorld, IEntries, ITypes }

export { GuitarWorld, Entries, Types }
