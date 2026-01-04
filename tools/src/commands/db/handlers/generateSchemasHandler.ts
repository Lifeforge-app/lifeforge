import path from 'path'

import Logging from '@/utils/logging'

import buildModuleCollectionsMap from '../functions/schema-generation/buildModuleCollectionsMap'
import filterCollectionsMap from '../functions/schema-generation/filterCollectionsMap'
import generateSchemaContent from '../functions/schema-generation/generateSchemaContent'
import getCollectionsFromPB from '../functions/schema-generation/getCollectionsFromPB'
import { writeFormattedFile } from '../utils'

/**
 * Command handler for generating database schemas
 */
export async function generateSchemaHandler(
  targetModule?: string
): Promise<void> {
  if (targetModule) {
    Logging.debug(
      `Generating schema for module: ${Logging.highlight(targetModule)}`
    )
  }

  const collections = await getCollectionsFromPB()

  const moduleCollectionsMap = await buildModuleCollectionsMap(collections)

  const filteredMap = filterCollectionsMap(moduleCollectionsMap, targetModule)

  const entries = Object.entries(filteredMap)

  if (entries.length === 0) {
    Logging.warn('No modules found to generate schemas for')

    return
  }

  await Promise.all(
    entries.map(async ([modulePath, moduleCollections]) => {
      const schemaPath = path.join(modulePath, 'schema.ts')

      const collectionCount = moduleCollections.length

      Logging.debug(
        `Writing ${Logging.highlight(String(collectionCount))} collections to ${Logging.dim(schemaPath)}`
      )

      await writeFormattedFile(
        schemaPath,
        generateSchemaContent(
          moduleCollections as Array<Record<string, unknown>>,
          new Map<string, string>(
            moduleCollections.map(
              collection => [collection.id, collection.name] as [string, string]
            )
          )
        )
      )
    })
  )

  Logging.success(
    `Generated schemas for ${Logging.highlight(String(entries.length))} modules`
  )
}
