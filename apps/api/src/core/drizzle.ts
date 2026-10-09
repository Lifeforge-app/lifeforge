import { defineRelations } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import { composeRelations, defineModuleSchema } from '@lifeforge/drizzle'
import { filesSchema } from '@lifeforge/file-storage/server'
import { ModuleRegistry } from '@lifeforge/module-registry'

import * as apiKeysSchema from '../lib/apiKeys/schema.drizzle'
import * as authSchema from '../lib/auth/schema.drizzle'
import * as fontsSchema from '../lib/fonts/schema.drizzle'
import * as userSchema from '../lib/user/schema.drizzle'

const connectionString = process.env.DATABASE_URL!

const client = postgres(connectionString, { max: 10, prepare: false })

const coreTables = {
  ...userSchema.tables,
  ...authSchema.tables,
  ...apiKeysSchema.tables,
  ...fontsSchema.tables,
  ...filesSchema.tables
}

const coreDefinition = defineModuleSchema(coreTables, r =>
  Object.assign(
    {},
    userSchema.relations(r),
    authSchema.relations(r),
    apiKeysSchema.relations(r),
    fontsSchema.relations(r),
    filesSchema.relations(r)
  )
)

ModuleRegistry.registerSchemaPart('core', coreDefinition)

const coreRelations = defineRelations(
  coreDefinition.tables,
  coreDefinition.relations
)

export type CoreRelations = typeof coreRelations

let db: PostgresJsDatabase<CoreRelations> = drizzle({
  client,
  relations: coreRelations
})

export { db }

export function initDrizzle(): void {
  db = drizzle({
    client,
    relations: composeRelations(ModuleRegistry.schemaParts)
  }) as unknown as PostgresJsDatabase<CoreRelations>
}
