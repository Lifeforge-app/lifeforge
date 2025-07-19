/**
 * This file is auto-generated. DO NOT EDIT IT MANUALLY.
 * You may regenerate it by running `bun run schema:generate:collection` in the root directory.
 * If you want to add custom schemas, you will find a dedicated space at the end of this file.
 * Generated for module: scoresLibrary
 * Generated at: 2025-07-19T14:07:18.234Z
 * Contains: scores_library__entries, scores_library__authors_aggregated, scores_library__types, scores_library__types_aggregated
 */
import { z } from 'zod/v4'

import { SchemaWithPB } from './schemaWithPB'

const Entry = z.object({
  name: z.string(),
  type: z.string(),
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

const Type = z.object({
  name: z.string(),
  icon: z.string()
})

const TypeAggregated = z.object({
  name: z.string(),
  icon: z.string(),
  amount: z.number()
})

type IEntry = z.infer<typeof Entry>
type IAuthorAggregated = z.infer<typeof AuthorAggregated>
type IType = z.infer<typeof Type>
type ITypeAggregated = z.infer<typeof TypeAggregated>

export { Entry, AuthorAggregated, Type, TypeAggregated }

export type { IEntry, IAuthorAggregated, IType, ITypeAggregated }

// -------------------- CUSTOM SCHEMAS --------------------

const SidebarData = z.object({
  total: z.number(),
  favourites: z.number(),
  types: z.array(SchemaWithPB(TypeAggregated)),
  authors: z.record(z.string(), z.number())
})

const GuitarWorldEntry = z.object({
  id: z.number(),
  name: z.string(),
  subtitle: z.string(),
  category: z.string(),
  mainArtist: z.string(),
  uploader: z.string(),
  audioUrl: z.string()
})

type ISidebarData = z.infer<typeof SidebarData>
type IGuitarWorldEntry = z.infer<typeof GuitarWorldEntry>

export { SidebarData, GuitarWorldEntry }

export type { ISidebarData, IGuitarWorldEntry }
