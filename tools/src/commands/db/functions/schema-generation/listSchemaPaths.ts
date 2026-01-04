import fs from 'fs'
import path from 'path'

import { PROJECT_ROOT } from '@/constants/constants'
import Logging from '@/utils/logging'

/**
 * Discovers all module directories that contain schema files.
 *
 * Scans two locations for `schema.ts` files:
 * 1. Core modules: `server/src/lib/**\/schema.ts` (built-in features like users, apiKeys)
 * 2. App modules: `apps\**\/server/schema.ts` (installed/created modules)
 *
 * Returns the parent directory of each schema file, which represents the module root.
 * For app modules, strips the trailing `/server` to get the actual module directory.
 *
 * @returns Array of absolute paths to module directories containing schema files
 *
 * @example
 * // Returns paths like:
 * // [
 * //   '/project/server/src/lib/user',
 * //   '/project/apps/lifeforge--calendar',
 * //   '/project/apps/melvinchia3636--invoice-maker'
 * // ]
 */
export function listSchemaPaths(): string[] {
  const modulesDirs = [
    './server/src/lib/**/schema.ts',
    './apps/**/server/schema.ts'
  ]

  let allModules: string[] = []

  try {
    allModules = modulesDirs
      .map(dir => fs.globSync(path.resolve(PROJECT_ROOT, dir)))
      .flat()
      .map(entry => path.dirname(entry).replace(/\/server$/, ''))
  } catch (error) {
    Logging.error(`Failed to read modules directory: ${error}`)
    process.exit(1)
  }

  return allModules
}
