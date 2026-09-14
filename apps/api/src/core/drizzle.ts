import { defineRelations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as achievementsSchema from '@modules/lifeforge-module-achievements/server/schema.drizzle'
import * as apiKeysSchema from '../lib/apiKeys/schema.drizzle'
import * as authSchema from '../lib/auth/schema.drizzle'
import * as userSchema from '../lib/user/schema.drizzle'

const connectionString = process.env.DATABASE_URL!

export const relations = defineRelations(
  {
    users: userSchema.users,
    userFontFamilyUpload: userSchema.userFontFamilyUpload,
    authRefreshTokens: authSchema.authRefreshTokens,
    authOAuthProviders: authSchema.authOAuthProviders,
    apiKeysEntries: apiKeysSchema.apiKeysEntries,
    achievementsCategories: achievementsSchema.achievementsCategories,
    achievementsEntries: achievementsSchema.achievementsEntries
  },
  (r) => ({
    achievementsCategories: {
      entries: r.many.achievementsEntries()
    },
    achievementsEntries: {
      category: r.one.achievementsCategories({
        from: r.achievementsEntries.categoryId,
        to: r.achievementsCategories.id
      })
    }
  })
)

export type AppRelations = typeof relations

const client = postgres(connectionString, { max: 1 })
export const db = drizzle({ client, relations })
