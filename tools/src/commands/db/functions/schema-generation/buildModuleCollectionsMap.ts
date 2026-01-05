import Logging from '@/utils/logging'

import { listSchemaPaths } from './listSchemaPaths'
import { matchCollectionToModule } from './matchCollectionToModule'

/**
 * Creates a mapping of module paths to their associated PocketBase collections.
 *
 * This function is the core of the schema generation process. It:
 * 1. Discovers all modules with schema files in the project
 * 2. Iterates through PocketBase collections
 * 3. Matches each collection to its owning module based on naming conventions
 * 4. Groups collections by their module path
 *
 * Collections that don't match any module (e.g., orphaned or third-party) are
 * logged in debug mode but excluded from the result.
 *
 * @param collections - Array of PocketBase collection objects from the database
 * @returns Map where keys are module directory paths and values are arrays of collections
 */
export default async function buildModuleCollectionsMap(
  collections: Array<Record<string, unknown>>
): Promise<Record<string, Record<string, unknown>[]>> {
  const moduleCollectionsMap: Record<string, Record<string, unknown>[]> = {}

  const allModules = listSchemaPaths()

  Logging.debug(
    `Found ${Logging.highlight(String(allModules.length))} modules with schema files`
  )

  let matchedCount = 0
  let unmatchedCount = 0

  for (const collection of collections) {
    const matchingModuleDir = await matchCollectionToModule(allModules, collection)

    if (!matchingModuleDir) {
      unmatchedCount++
      Logging.debug(
        `Collection ${Logging.highlight(collection.name as string)} has no matching module`
      )
      continue
    }

    matchedCount++

    if (!moduleCollectionsMap[matchingModuleDir]) {
      moduleCollectionsMap[matchingModuleDir] = []
    }

    moduleCollectionsMap[matchingModuleDir].push(collection)
  }

  Logging.debug(
    `Matched ${Logging.highlight(String(matchedCount))} collections to modules, ${unmatchedCount} unmatched`
  )

  return moduleCollectionsMap
}
