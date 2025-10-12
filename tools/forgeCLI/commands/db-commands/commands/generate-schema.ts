import chalk from 'chalk'
import path from 'path'
import PocketBase from 'pocketbase'

import { CLILoggingService } from '../../../utils/logging'
import {
  buildModuleCollectionsMap,
  generateMainSchemaContent,
  processSchemaGeneration
} from '../functions/schema-generation'
import { validateEnvironment, writeFormattedFile } from '../utils/file-utils'

/**
 * Command handler for generating database schemas
 */
export async function generateSchemaHandler(
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.info('Starting schema generation process...')

    const env = validateEnvironment()
    if (!env.PB_HOST || !env.PB_EMAIL || !env.PB_PASSWORD) {
      CLILoggingService.error(
        'Missing required environment variables: PB_HOST, PB_EMAIL, and PB_PASSWORD'
      )
      process.exit(1)
    }

    // Authenticate with PocketBase
    const pb = new PocketBase(env.PB_HOST)
    try {
      await pb
        .collection('_superusers')
        .authWithPassword(env.PB_EMAIL, env.PB_PASSWORD)

      if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
        throw new Error('Invalid credentials or insufficient permissions')
      }
    } catch (error) {
      CLILoggingService.error(
        `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
      process.exit(1)
    }

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
        '../../../../../server/src/core/schema.ts'
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
  } catch (error) {
    CLILoggingService.error(`Schema generation failed: ${error}`)
    process.exit(1)
  }
}
