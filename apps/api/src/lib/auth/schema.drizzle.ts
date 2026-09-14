import { defineRelations } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

export const authRefreshTokens = pgTable('auth__refresh_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  token_hash: varchar('token_hash', { length: 255 }).notNull(),
  family: varchar('family', { length: 255 }).notNull(),
  bound_ip: varchar('bound_ip', { length: 255 }).notNull(),
  last_ip: varchar('last_ip', { length: 255 }).notNull(),
  expires_at: timestamp('expires_at', { mode: 'date' }).notNull(),
  revoked: boolean('revoked').default(false).notNull(),
  last_used_at: timestamp('last_used_at', { mode: 'date' }).defaultNow().notNull(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const authOAuthProviders = pgTable('auth__oauth_providers', {
  id: uuid('id').defaultRandom().primaryKey(),
  provider: varchar('provider', { length: 255 }).notNull().unique(),
  enabled: boolean('enabled').default(false).notNull(),
  client_id: varchar('client_id', { length: 500 }),
  client_secret: varchar('client_secret', { length: 500 }),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const authRelations = defineRelations(
  { authRefreshTokens, authOAuthProviders },
  () => ({})
)
