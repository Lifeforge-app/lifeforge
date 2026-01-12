import { LOG_LEVELS } from '@lifeforge/log'

import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'

/**
 * Runs `pocketbase migrate up` to apply all pending migrations in the migrations directory.
 *
 * In debug mode, outputs the full migration log to the console.
 * Otherwise, suppresses output for cleaner logs.
 *
 * @throws Error if the migration command fails
 */
export default function applyStagedMigration(): void {
  logger.debug('Applying pending migrations...')

  executeCommand(`${PB_BINARY_PATH} migrate up ${PB_KWARGS.join(' ')}`, {
    stdio:
      LOG_LEVELS.indexOf(logger.level) > LOG_LEVELS.indexOf('debug')
        ? 'pipe'
        : 'inherit'
  })

  logger.debug('Migrations applied successfully')
}
