import chalk from 'chalk'
import path from 'path'

import {
  checkRunningPBInstances,
  killExistingProcess,
  validateEnvironment
} from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import { startPocketBaseAndGetPid } from '../functions/database-initialization'
import {
  buildModuleCollectionsMap,
  generateMainSchemaContent,
  processSchemaGeneration
} from '../functions/schema-generation'
import { writeFormattedFile } from '../utils/file-utils'
import getPocketbaseInstance, {
  validatePocketBaseSetup
} from '../utils/pocketbase-utils'

/**
 * Command handler for generating database schemas
 */
export async function generateSchemaHandler(
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.info('Starting schema generation process...')

    validateEnvironment(['PB_HOST', 'PB_EMAIL', 'PB_PASSWORD', 'PB_DIR'])

    const pbRunning = checkRunningPBInstances(false)

    let pbPid: number

    if (!pbRunning) {
      const { pbInstancePath } = await validatePocketBaseSetup(
        process.env.PB_DIR!
      )

      pbPid = await startPocketBaseAndGetPid(pbInstancePath)
    }

    // Authenticate with PocketBase
    const pb = await getPocketbaseInstance()

    // Fetch collections
    CLILoggingService.debug('Fetching collections from PocketBase...')

    const allCollections = await pb.collections.getFullList()

    const userCollections = allCollections.filter(
      (collection: any) => !collection.system
    )

    CLILoggingService.info(
      `Found ${userCollections.length} user-defined collections`
    )

    // Build module mapping
    const moduleCollectionsMap =
      await buildModuleCollectionsMap(userCollections)

    // Process schema generation
    const { moduleSchemas, moduleDirs } = await processSchemaGeneration(
      moduleCollectionsMap,
      targetModule
    )

    // Generate and write main schema file if not targeting a specific module
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

    // Summary
    const moduleCount = Object.keys(moduleSchemas).length

    CLILoggingService.info(
      targetModule
        ? `Schema generation completed for module ${chalk.bold.blue(targetModule)}!`
        : `Schema generation completed! Created ${moduleCount} module schema files.`
    )

    if (!pbRunning) {
      killExistingProcess(pbPid!)
    }
  } catch (error) {
    CLILoggingService.error(`Schema generation failed: ${error}`)
    process.exit(1)
  }
}
