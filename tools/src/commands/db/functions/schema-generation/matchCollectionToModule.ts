import chalk from 'chalk'
import fs from 'fs'
import _ from 'lodash'
import path from 'path'

import { parsePackageName } from '@/commands/modules/functions/parsePackageName'
import { ROOT_DIR } from '@/constants/constants'
import logger from '@/utils/logger'

/**
 * Finds the module that owns a given PocketBase collection.
 *
 * PocketBase collection names follow a naming convention:
 * - First-party: `moduleName__collectionName` (e.g., `events`)
 * - Third-party: `username___moduleName__collectionName` (e.g., `melvinchia3636___clients`)
 *
 * This function parses the collection name and matches it against registered modules
 * by comparing the username and module name prefixes.
 *
 * Special case: The `users` collection maps to the `user` module.
 *
 * @param modulesWithSchema - Array of module directory paths from `listSchemaPaths()`
 * @param collection - PocketBase collection object with `name` property
 * @returns Matching module directory path, or undefined if no match found
 *
 * @example
 * // Collection 'events' matches module at '/apps/lifeforge--calendar'
 * // Collection 'melvinchia3636___clients' matches '/apps/melvinchia3636--invoice-maker'
 */
export async function matchCollectionToModule(
  modulesWithSchema: string[],
  allModules: string[],
  collection: Record<string, unknown>
) {
  const { parseCollectionName } = await import('shared')

  const collectionName = collection.name as string

  const parsed = parseCollectionName(
    collectionName,
    'pb',
    collectionName === 'users' ? 'user' : undefined
  )

  const modulePrefix = parsed.username
    ? `${parsed.username}___${parsed.moduleName}`
    : parsed.moduleName

  const matchingModule = modulesWithSchema.find(module => {
    const { username, moduleName } = parsePackageName(
      path.basename(module),
      path.dirname(module).endsWith('/server/src/lib')
    )

    const expectedPrefix = username
      ? `${username}___${_.snakeCase(moduleName)}`
      : _.snakeCase(moduleName)

    return modulePrefix === expectedPrefix
  })

  if (!matchingModule) {
    const targetModule = allModules.find(module => {
      const { username, moduleName } = parsePackageName(path.basename(module))

      const expectedPrefix = username
        ? `${username}___${_.snakeCase(moduleName)}`
        : _.snakeCase(moduleName)

      return modulePrefix === expectedPrefix
    })

    if (targetModule) {
      const schemaPath = path.resolve(
        ROOT_DIR,
        'apps',
        targetModule.split('/').pop()!,
        'server',
        'schema.ts'
      )

      if (!fs.existsSync(schemaPath)) {
        logger.info(
          `Found ${chalk.blue(targetModule)} with matching collection prefix, but no schema file found at ${chalk.blue(schemaPath)}. Creating...`
        )

        fs.writeFileSync(schemaPath, '')

        return targetModule.split('/').pop()!
      }
    }
  }

  return matchingModule
}
