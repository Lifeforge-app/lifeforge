import chalk from 'chalk'

import logger from '@/utils/logger'

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
    logger.debug(`Generating schema for module: ${chalk.blue(targetModule)}`)
  }

  const collections = await getCollectionsFromPB()

  const moduleCollectionsMap = await buildModuleCollectionsMap(collections)

  const filteredMap = filterCollectionsMap(moduleCollectionsMap, targetModule)

  const entries = Object.entries(filteredMap)

  if (entries.length === 0) {
    logger.warn('No modules found to generate schemas for')

    return
  }

  await Promise.all(
    entries.map(async ([modulePath, moduleCollections]) => {
      const collectionCount = moduleCollections.length

      logger.debug(
        `Writing ${chalk.blue(String(collectionCount))} collections for module ${chalk.dim(modulePath)}`
      )

      await writeFormattedFile(
        modulePath,
        await generateSchemaContent(
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

  logger.success(
    `Generated schemas for ${chalk.blue(String(entries.length))} modules`
  )
}
