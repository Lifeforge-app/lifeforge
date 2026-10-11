import fs from 'node:fs'
import path from 'node:path'

import { ROOT_DIR } from '@/constants/constants'

import executeCommand from './commands'

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
 * Synchronizes a single module's schema with the database, applying only that
 * module's changes (creates + alters) and never touching other modules'
 * objects. Delegates to apps/api's `push-module-schema` script, which reuses
 * drizzle-kit's diff engine scoped to the module.
 */
export async function syncModuleSchema(moduleDir: string): Promise<void> {
  if (!resolveModuleSchemaFile(moduleDir)) {
    return
  }

  // Prevent the forge CLI's --tsconfig from leaking into the child process.
  delete process.env.TSX_TSCONFIG_PATH

  executeCommand(
    `pnpm --filter @lifeforge/server exec tsx scripts/push-module-schema.ts "${moduleDir}"`,
    { cwd: ROOT_DIR }
  )
}
