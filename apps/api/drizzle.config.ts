import dotenv from 'dotenv'
import { defineConfig } from 'drizzle-kit'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '../../env/.env.local') })

const modulesDir = path.resolve(__dirname, '../../modules')

/**
 * Resolves each installed module's drizzle schema path, preferring the source
 * (`server/schema.drizzle.ts`) and falling back to the compiled
 * `server/dist/schema.js` for modules whose source has been cleaned.
 */
function getModuleSchemas(): string[] {
  if (!fs.existsSync(modulesDir)) {
    return []
  }

  return fs
    .readdirSync(modulesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => {
      const source = path.join(
        modulesDir,
        dirent.name,
        'server',
        'schema.drizzle.ts'
      )

      if (fs.existsSync(source)) {
        return source
      }

      const compiled = path.join(
        modulesDir,
        dirent.name,
        'server',
        'dist',
        'schema.js'
      )

      return fs.existsSync(compiled) ? compiled : null
    })
    .filter((schemaPath): schemaPath is string => schemaPath !== null)
}

export default defineConfig({
  schema: [
    './src/lib/**/schema.drizzle.ts',
    ...getModuleSchemas(),
    '../../packages/file-storage/src/server/metadata/schema.drizzle.ts'
  ],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
})
