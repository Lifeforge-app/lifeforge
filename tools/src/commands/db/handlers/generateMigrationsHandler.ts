import logger from '@/utils/logger'
import getPBInstance from '@/utils/pocketbase'

import { cleanupOldMigrations } from '../functions/migration-generation/cleanupOldMigrations'
import stageMigration from '../functions/migration-generation/stageMigrations'
import { importSchemaModules } from '../utils'

/**
 * Command handler for generating database migrations
 */
export async function generateMigrationsHandler(
  targetModule?: string
): Promise<void> {
  cleanupOldMigrations()

  const { pb, killPB } = await getPBInstance()

  try {
    const importedSchemas = await importSchemaModules(targetModule)

    for (const [index, phase] of Object.entries([
      'skeleton',
      'structure',
      'views'
    ] as const)) {
      await stageMigration(pb, phase, Number(index), importedSchemas)
      cleanupOldMigrations()
    }

    killPB?.()

    logger.success('Migrations generated successfully')
  } catch (error) {
    logger.error('Migration script failed')
    logger.debug(`Error details: ${error}`)

    killPB?.()
    process.exit(1)
  }
}
