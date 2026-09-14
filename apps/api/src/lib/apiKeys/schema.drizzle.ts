import { defineRelations } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

export const apiKeysEntries = pgTable('api_keys__entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  keyId: varchar('key_id', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  icon: varchar('icon', { length: 255 }).notNull(),
  key: varchar('key', { length: 500 }).notNull(),
  exposable: boolean('exposable').default(false).notNull(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const apiKeysRelations = defineRelations(
  { apiKeysEntries },
  () => ({})
)
