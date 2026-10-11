import fs from 'node:fs'
import path from 'node:path'

import { ROOT_DIR } from '@/constants/constants'

import { pushSchemaFiles } from './pushSchema'

/**
 * Resolves a module's drizzle schema file, preferring the source and falling
 * back to the compiled `server/dist/schema.js`.
 */
export function resolveModuleSchemaFile(moduleDir: string): string | null {
  const source = path.join(moduleDir, 'server', 'schema.drizzle.ts')

  if (fs.existsSync(source)) {
    return source
  }

  const compiled = path.join(moduleDir, 'server', 'dist', 'schema.js')

  return fs.existsSync(compiled) ? compiled : null
}

/**
 * Collects every schema file the app should be in sync with: the core schemas,
 * the file-storage metadata schema, and every installed module's schema.
 */
export function collectAllSchemaFiles(): string[] {
  const files: string[] = []

  const libDir = path.join(ROOT_DIR, 'apps', 'api', 'src', 'lib')

  if (fs.existsSync(libDir)) {
    for (const dirent of fs.readdirSync(libDir, { withFileTypes: true })) {
      if (!dirent.isDirectory()) continue

      const schema = path.join(libDir, dirent.name, 'schema.drizzle.ts')

      if (fs.existsSync(schema)) {
        files.push(schema)
      }
    }
  }

  const fileStorageSchema = path.join(
    ROOT_DIR,
    'packages',
    'file-storage',
    'src',
    'server',
    'metadata',
    'schema.drizzle.ts'
  )

  if (fs.existsSync(fileStorageSchema)) {
    files.push(fileStorageSchema)
  }

  const modulesDir = path.join(ROOT_DIR, 'modules')

  if (fs.existsSync(modulesDir)) {
    for (const dirent of fs.readdirSync(modulesDir, { withFileTypes: true })) {
      if (!dirent.isDirectory() || dirent.name.startsWith('.')) continue

      const schema = resolveModuleSchemaFile(path.join(modulesDir, dirent.name))

      if (schema) {
        files.push(schema)
      }
    }
  }

  return files
}

/**
 * Synchronizes a single module's schema with the database, applying only that
 * module's changes (creates + alters) and never touching other modules'
 * objects or discarding anything.
 */
export async function syncModuleSchema(moduleDir: string): Promise<void> {
  const schemaFile = resolveModuleSchemaFile(moduleDir)

  if (!schemaFile) {
    return
  }

  const { failures } = await pushSchemaFiles([schemaFile])

  if (failures.length > 0) {
    throw new Error(failures.join('\n'))
  }
}
