import path from 'path'

import { parsePackageName } from '@/commands/modules/functions/parsePackageName'
import { parseCollectionName } from '@/utils/pocketbase'

/**
 * Finds the module that owns a given PocketBase collection.
 *
 * PocketBase collection names follow a naming convention:
 * - First-party: `moduleName__collectionName` (e.g., `calendar__events`)
 * - Third-party: `username___moduleName__collectionName` (e.g., `melvinchia3636___invoice_maker__clients`)
 *
 * This function parses the collection name and matches it against registered modules
 * by comparing the username and module name prefixes.
 *
 * Special case: The `users` collection maps to the `user` module.
 *
 * @param allModules - Array of module directory paths from `listSchemaPaths()`
 * @param collection - PocketBase collection object with `name` property
 * @returns Matching module directory path, or undefined if no match found
 *
 * @example
 * // Collection 'calendar__events' matches module at '/apps/lifeforge--calendar'
 * // Collection 'melvinchia3636___invoice_maker__clients' matches '/apps/melvinchia3636--invoice-maker'
 */
export function matchCollectionToModule(
  allModules: string[],
  collection: Record<string, unknown>
) {
  const collectionName = collection.name as string

  const parsed = parseCollectionName(
    collectionName,
    'pb',
    collectionName === 'users' ? 'user' : undefined
  )

  const modulePrefix = parsed.username
    ? `${parsed.username}___${parsed.moduleName}`
    : parsed.moduleName

  const matchingModule = allModules.find(module => {
    const { username, moduleName } = parsePackageName(
      path.basename(module),
      path.dirname(module).endsWith('/server/src/lib')
    )

    const expectedPrefix = username ? `${username}___${moduleName}` : moduleName

    return modulePrefix === expectedPrefix
  })

  return matchingModule
}
