import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import executeCommand from '@/utils/commands'
import Logging, { LEVEL_ORDER } from '@/utils/logging'

/**
 * Runs `pocketbase migrate up` to apply all pending migrations in the migrations directory.
 *
 * In debug mode, outputs the full migration log to the console.
 * Otherwise, suppresses output for cleaner logs.
 *
 * @throws Error if the migration command fails
 */
export default function applyStagedMigration(): void {
  Logging.debug('Applying pending migrations...')

  executeCommand(`${PB_BINARY_PATH} migrate up ${PB_KWARGS.join(' ')}`, {
    stdio: Logging.level > LEVEL_ORDER.debug ? 'pipe' : 'inherit'
  })

  Logging.debug('Migrations applied successfully')
}
