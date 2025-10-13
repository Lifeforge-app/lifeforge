import chalk from 'chalk'

import { checkRunningPBInstances } from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import { createMigrationFile } from '../functions/migration-generation'
import {
  getSchemaFiles,
  importSchemaModules,
  validateEnvironment
} from '../utils/file-utils'
import {
  cleanupOldMigrations,
  validatePocketBaseSetup
} from '../utils/pocketbase-utils'

/**
 * Command handler for generating database migrations
 */
export async function generateMigrationsHandler(
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.info('Starting migration script...')

    const env = validateEnvironment()

    if (!env.PB_DIR) {
      CLILoggingService.error('Missing required environment variable: PB_DIR')
      process.exit(1)
    }

    const { pbInstancePath, pbDir } = await validatePocketBaseSetup(env.PB_DIR)

    // Check for running instances
    checkRunningPBInstances()

    // Clean up old migrations
    await cleanupOldMigrations(pbDir, pbInstancePath, targetModule)

    // Get and process schema files
    const schemaFiles = getSchemaFiles(targetModule)

    CLILoggingService.info(
      targetModule
        ? `Processing module: ${chalk.bold.blue(targetModule)}`
        : `Found ${chalk.bold.blue(schemaFiles.length)} schema files.`
    )

    const importedSchemas = await importSchemaModules(schemaFiles)

    // Process migrations
    for (const { moduleName, schema } of importedSchemas) {
      const result = await createMigrationFile(
        moduleName,
        schema,
        pbInstancePath
      )

      if (!result.success) {
        CLILoggingService.error(
          `Migration process failed for module ${moduleName}`
        )
        process.exit(1)
      }
    }

    // Summary
    CLILoggingService.info(
      targetModule
        ? `Migration script completed for module ${chalk.bold.blue(
            targetModule
          )}. Start the PocketBase server or run the command "pocketbase migrate up" to apply migrations.`
        : 'Migration script completed. Start the PocketBase server or run the command "pocketbase migrate up" to apply migrations.'
    )
  } catch (error) {
    CLILoggingService.error(
      `Migration script failed: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
  }
}
