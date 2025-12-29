import chalk from 'chalk'
import path from 'path'

import { isDockerMode } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import getPBInstance from '@/utils/pocketbase'

import { generateMainSchemaContent } from '../functions/schema-generation/content-generator'
import { buildModuleCollectionsMap } from '../functions/schema-generation/module-mapper'
import { processSchemaGeneration } from '../functions/schema-generation/schema-processor'
import { writeFormattedFile } from '../utils/file-utils'

/**
 * Command handler for generating database schemas
 */
export async function generateSchemaHandler(
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.info('Starting schema generation process...')

    const { pb, killPB } = await getPBInstance(!isDockerMode())

    CLILoggingService.debug('Fetching collections from PocketBase...')

    const allCollections = await pb.collections.getFullList()

    const userCollections = allCollections.filter(
      collection => !collection.system
    )

    CLILoggingService.info(
      `Found ${userCollections.length} user-defined collections`
    )

    // Build ID-to-name map for all collections (including system)
    // This allows relation fields to reference collections by name instead of ID
    const idToNameMap = new Map<string, string>()

    for (const collection of allCollections) {
      idToNameMap.set(collection.id, collection.name)
    }

    const moduleCollectionsMap =
      await buildModuleCollectionsMap(userCollections)

    const { moduleSchemas, moduleDirs } = await processSchemaGeneration(
      moduleCollectionsMap,
      idToNameMap,
      targetModule
    )

    if (!targetModule) {
      const mainSchemaContent = generateMainSchemaContent(moduleDirs)

      const coreSchemaPath = path.resolve(
        __dirname,
        '../../../../../../server/src/core/schema.ts'
      )

      await writeFormattedFile(coreSchemaPath, mainSchemaContent)
      CLILoggingService.debug(
        `Updated main schema file at ${chalk.bold('core/schema.ts')}`
      )
    }

    const moduleCount = Object.keys(moduleSchemas).length

    CLILoggingService.info(
      targetModule
        ? `Schema generation completed for module ${chalk.bold.blue(targetModule)}!`
        : `Schema generation completed! Created ${moduleCount} module schema files.`
    )

    killPB?.()
  } catch (error) {
    CLILoggingService.error(`Schema generation failed: ${error}`)
    process.exit(1)
  }
}
