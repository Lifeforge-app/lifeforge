import logger from '@/utils/logger'

import buildIdToNameMap from '../functions/migration-generation/buildIdToNameMap'
import stageMigration from '../functions/migration-generation/stageMigrations'
import { importSchemaModules } from '../utils'
import { cleanupOldMigrations } from '../utils/pocketbase-utils'

/**
 * Command handler for generating database migrations
 */
export async function generateMigrationsHandler(
  targetModule?: string
): Promise<void> {
  try {
    await cleanupOldMigrations(targetModule)

    const importedSchemas = await importSchemaModules(targetModule)

    const idToNameMap = await buildIdToNameMap(targetModule)

    for (const [index, phase] of Object.entries([
      'skeleton',
      'structure',
      'views'
    ] as const)) {
      await stageMigration(phase, Number(index), importedSchemas, idToNameMap)
    }

    logger.success('Migrations generated successfully')
  } catch (error) {
    logger.actionableError(
      'Migration script failed',
      'Check the schema definitions and PocketBase configuration'
    )
    logger.debug(
      `Error details: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
  }
}
