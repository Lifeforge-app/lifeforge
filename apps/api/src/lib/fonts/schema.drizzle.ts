import { pgTable, real, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

import { type RelationsBuilder } from '@lifeforge/drizzle'

export const fontsFontFamilyUpload = pgTable('fonts__font_family_upload', {
  id: uuid('id').defaultRandom().primaryKey(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  family: varchar('family', { length: 255 }).notNull(),
  file: varchar('file', { length: 255 }).notNull(),
  weight: real('weight').default(400).notNull(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const fontsPinnedFonts = pgTable('fonts__pinned_fonts', {
  family: varchar('family', { length: 255 }).primaryKey(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull()
})

export const tables = { fontsFontFamilyUpload, fontsPinnedFonts }
export const relations = (_r: RelationsBuilder<typeof tables>) => ({})
