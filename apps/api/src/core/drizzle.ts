import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as achievementsSchema from '../../modules/lifeforge-module-achievements/server/schema.drizzle'

const connectionString = process.env.DATABASE_URL!

const schema = {
  ...achievementsSchema
}

const client = postgres(connectionString, { max: 1 })
export const db = drizzle(client, { schema })
