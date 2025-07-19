/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: scoresLibrary
 * Generated at: 2025-07-18T12:15:50.183Z
 * Contains: scores_library__entries, scores_library__authors_aggregated
 */
import { z } from 'zod/v4'

const Entry = z.object({
  name: z.string(),
  type: z.enum(['fingerstyle', 'singalong', '']),
  pageCount: z.string(),
  thumbnail: z.string(),
  author: z.string(),
  pdf: z.string(),
  audio: z.string(),
  musescore: z.string(),
  isFavourite: z.boolean()
})

const AuthorAggregated = z.object({
  name: z.string(),
  amount: z.number()
})

type IEntry = z.infer<typeof Entry>
type IAuthorAggregated = z.infer<typeof AuthorAggregated>

export { Entry, AuthorAggregated }

export type { IEntry, IAuthorAggregated }

// -------------------- CUSTOM SCHEMAS --------------------

const ScoresLibrarySidebarDataSchema = z.object({
  total: z.number(),
  favourites: z.number(),
  categories: z.object({
    fingerstyle: z.number(),
    singalong: z.number(),
    uncategorized: z.number()
  }),
  authors: z.record(z.string(), z.number())
})

const ScoresLibraryGuitarWorldEntrySchema = z.object({
  id: z.number(),
  name: z.string(),
  subtitle: z.string(),
  category: z.string(),
  mainArtist: z.string(),
  uploader: z.string(),
  audioUrl: z.string()
})

type IScoresLibrarySidebarData = z.infer<typeof ScoresLibrarySidebarDataSchema>
type IScoresLibraryGuitarWorldEntry = z.infer<
  typeof ScoresLibraryGuitarWorldEntrySchema
>

export { ScoresLibrarySidebarDataSchema, ScoresLibraryGuitarWorldEntrySchema }

export type { IScoresLibrarySidebarData, IScoresLibraryGuitarWorldEntry }
