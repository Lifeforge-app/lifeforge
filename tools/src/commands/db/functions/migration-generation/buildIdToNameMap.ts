import path from 'path'

import Logging from '@/utils/logging'

import { getSchemaFiles } from '../../utils'

/**
 * Builds a mapping from PocketBase collection IDs to their human-readable names.
 *
 * This map is essential for resolving relation fields during migration generation,
 * as relations store collection IDs but we need to reference collections by name
 * in the generated `schema.ts` for portability across environments.
 *
 * @param targetModule - Optional module name to filter schemas. If omitted, processes all modules.
 * @returns A Map where keys are collection IDs and values are collection names
 *
 * @example
 * const idMap = await buildIdToNameMap()
 * // Map { 'abc123' => 'users', 'def456' => 'posts' }
 */
export default async function buildIdToNameMap(
  targetModule?: string
): Promise<Map<string, string>> {
  const schemaFiles = getSchemaFiles(targetModule)

  const idToNameMap = new Map<string, string>()

  for (const schemaPath of schemaFiles) {
    const schema: Record<
      string,
      {
        raw: {
          id: string
          name: string
        }
      }
    > = await import(path.resolve(schemaPath))

    for (const entry of Object.values(schema)) {
      const raw = entry?.raw

      if (raw?.id && raw?.name) {
        idToNameMap.set(raw.id as string, raw.name as string)
      }
    }
  }

  Logging.debug(`Built ID-to-name map with ${idToNameMap.size} collections`)

  return idToNameMap
}
