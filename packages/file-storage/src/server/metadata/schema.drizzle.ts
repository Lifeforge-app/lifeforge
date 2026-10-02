import {
  integer,
  jsonb,
  pgTable,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'

import { type RelationsBuilder } from '@lifeforge/drizzle'

import type { ThumbnailInfo } from '../../core/contract/fileReference'

export const files = pgTable('files', {
  key: varchar('key', { length: 512 }).primaryKey(),
  originalName: varchar('original_name', { length: 512 }).notNull(),
  mimeType: varchar('mime_type', { length: 255 }).notNull(),
  size: integer('size').notNull(),
  thumbs: jsonb('thumbs').$type<ThumbnailInfo[]>().default([]).notNull(),
  moduleId: varchar('module_id', { length: 255 }).notNull(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull()
})

export const tables = { files }

export const relations = (_r: RelationsBuilder<typeof tables>) => ({})

export const filesSchema = { tables, relations }
