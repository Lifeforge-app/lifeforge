import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../env/.env.local') })

export default defineConfig({
  schema: [
    './src/lib/**/schema.drizzle.ts',
    '../../modules/**/schema.drizzle.ts',
    '../../packages/file-storage/src/server/metadata/schema.drizzle.ts'
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
