import chalk from 'chalk'

import { isDockerMode } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import {
  createSkeletonMigration,
  createStructureMigration,
  createViewQueryMigration,
  runMigrateUp
} from '../functions/migration-generation/migration-file'
import { getSchemaFiles, importSchemaModules } from '../utils/file-utils'
import { cleanupOldMigrations } from '../utils/pocketbase-utils'

/**
 * Builds an ID-to-name map from all schemas
 */
function buildIdToNameMap(
  importedSchemas: Array<{
    moduleName: string
    schema: Record<string, { raw: Record<string, unknown> }>
  }>
): Map<string, string> {
  const idToNameMap = new Map<string, string>()

  for (const { schema } of importedSchemas) {
    for (const { raw } of Object.values(schema)) {
      if (raw.id && raw.name) {
        idToNameMap.set(raw.id as string, raw.name as string)
      }
    }
  }

  return idToNameMap
}

/**
 * Command handler for generating database migrations
 *
 * Five-phase approach:
 * 1. Generate skeleton migrations for all modules (stub collections)
 * 2. Run migrate up to apply skeletons (all collections now exist)
 * 3. Generate structure migrations for all modules (full schema with relations)
 * 4. Run migrate up to apply structures (all structures now in place)
 * 5. Generate view query migrations for modules with view collections
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

    // Build ID-to-name map from all schemas for relation resolution
    const idToNameMap = buildIdToNameMap(importedSchemas)

    CLILoggingService.debug(
      `Built ID-to-name map with ${idToNameMap.size} collections`
    )

    // Phase 1: Generate all skeleton migrations
    CLILoggingService.step('Phase 1: Creating skeleton migrations...')

    for (const { moduleName, schema } of importedSchemas) {
      const result = await createSkeletonMigration(moduleName, schema)

      if (!result.success) {
        CLILoggingService.actionableError(
          `Skeleton migration failed for module ${moduleName}`,
          'Check the module schema definition for syntax errors'
        )
        process.exit(1)
      }
    }

    CLILoggingService.success(
      `Created ${importedSchemas.length} skeleton migrations`
    )

    // Phase 2: Run migrate up to apply skeleton migrations
    CLILoggingService.step('Phase 2: Applying skeleton migrations...')
    runMigrateUp()

    // Phase 3: Generate all structure migrations
    CLILoggingService.step('Phase 3: Creating structure migrations...')

    for (const { moduleName, schema } of importedSchemas) {
      const result = await createStructureMigration(
        moduleName,
        schema,
        idToNameMap
      )

      if (!result.success) {
        CLILoggingService.actionableError(
          `Structure migration failed for module ${moduleName}`,
          'Check the module schema definition for syntax errors'
        )
        process.exit(1)
      }
    }

    CLILoggingService.success(
      `Created ${importedSchemas.length} structure migrations`
    )

    // Phase 4: Run migrate up to apply structure migrations
    CLILoggingService.step('Phase 4: Applying structure migrations...')
    runMigrateUp()

    // Phase 5: Generate view query migrations (for modules with view collections)
    CLILoggingService.step('Phase 5: Creating view query migrations...')

    let viewMigrationCount = 0

    for (const { moduleName, schema } of importedSchemas) {
      const result = await createViewQueryMigration(moduleName, schema)

      if (!result.success) {
        CLILoggingService.actionableError(
          `View query migration failed for module ${moduleName}`,
          'Check the view query definition for syntax errors'
        )
        process.exit(1)
      }

      if (result.hasViews) {
        viewMigrationCount++
      }
    }

    if (viewMigrationCount > 0) {
      CLILoggingService.success(
        `Created ${viewMigrationCount} view query migrations`
      )

      // Phase 6: Apply view query migrations
      CLILoggingService.step('Phase 6: Applying view query migrations...')
      runMigrateUp()
    } else {
      CLILoggingService.info(
        'No view collections found, skipping view migrations'
      )
    }

    // Summary
    const message = targetModule
      ? `Migration script completed for module ${chalk.bold.blue(targetModule)}`
      : 'Migration script completed for all modules'

    CLILoggingService.success(message)
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
