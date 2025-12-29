import chalk from 'chalk'

import { isDockerMode } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import { createMigrationFile } from '../functions/migration-generation/migration-file'
import { getSchemaFiles, importSchemaModules } from '../utils/file-utils'
import { cleanupOldMigrations } from '../utils/pocketbase-utils'

/**
 * Command handler for generating database migrations
 */
export async function generateMigrationsHandler(
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.step('Starting database migration generation')

    // Skip running instances check in Docker mode (we control the container)
    if (!isDockerMode()) {
      checkRunningPBInstances()
    }

    await cleanupOldMigrations(targetModule)

    const schemaFiles = getSchemaFiles(targetModule)

    CLILoggingService.info(
      targetModule
        ? `Processing module: ${chalk.bold.blue(targetModule)}`
        : `Found ${chalk.bold.blue(schemaFiles.length)} schema files.`
    )

    const importedSchemas = await importSchemaModules(schemaFiles)

    // Process migrations
    for (const { moduleName, schema } of importedSchemas) {
      const result = await createMigrationFile(moduleName, schema)

      if (!result.success) {
        CLILoggingService.actionableError(
          `Migration process failed for module ${moduleName}`,
          'Check the module schema definition for syntax errors'
        )
        process.exit(1)
      }
    }

    // Summary
    const message = targetModule
      ? `Migration script completed for module ${chalk.bold.blue(targetModule)}`
      : 'Migration script completed for all modules'

    CLILoggingService.success(message)
    CLILoggingService.info(
      'Next: Start PocketBase server or run "pocketbase migrate up" to apply migrations'
    )
  } catch (error) {
    CLILoggingService.actionableError(
      'Migration script failed',
      'Check the schema definitions and PocketBase configuration'
    )
    CLILoggingService.debug(
      `Error details: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
  }
}
