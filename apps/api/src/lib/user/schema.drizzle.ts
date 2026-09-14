import { defineRelations } from 'drizzle-orm'
import {
  boolean,
  json,
  pgTable,
  real,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVisibility: boolean('email_visibility').default(false).notNull(),
  verified: boolean('verified').default(false).notNull(),
  username: varchar('username', { length: 150 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  avatar: varchar('avatar', { length: 255 }),
  dateOfBirth: varchar('date_of_birth', { length: 50 }),
  theme: varchar('theme', { length: 50 }).default('system').notNull(),
  color: varchar('color', { length: 50 }),
  bgTemp: varchar('bg_temp', { length: 255 }),
  bgImage: varchar('bg_image', { length: 255 }),
  backdropFilters: json('backdrop_filters').$type<Record<string, unknown>>(),
  fontFamily: varchar('font_family', { length: 255 }),
  dashboardLayout: json('dashboard_layout').$type<Record<string, unknown>>(),
  APIKeysMasterPasswordHash: varchar('api_keys_master_password_hash', {
    length: 255
  }),
  twoFASecret: varchar('two_fa_secret', { length: 255 }),
  fontScale: real('font_scale').default(1.0).notNull(),
  pinnedFontFamilies: json('pinned_font_families').$type<string[]>(),
  borderRadiusMultiplier: real('border_radius_multiplier').default(1.0).notNull(),
  bordered: boolean('bordered').default(false).notNull(),
  language: varchar('language', { length: 50 }).default('en').notNull(),
  auth_password_hash: varchar('auth_password_hash', { length: 255 }),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const userFontFamilyUpload = pgTable('user__font_family_upload', {
  id: uuid('id').defaultRandom().primaryKey(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  family: varchar('family', { length: 255 }).notNull(),
  file: varchar('file', { length: 255 }).notNull(),
  weight: real('weight').default(400).notNull(),
  created: timestamp('created', { mode: 'date' }).defaultNow().notNull(),
  updated: timestamp('updated', { mode: 'date' }).defaultNow().notNull()
})

export const userRelations = defineRelations(
  { users, userFontFamilyUpload },
  () => ({})
)
