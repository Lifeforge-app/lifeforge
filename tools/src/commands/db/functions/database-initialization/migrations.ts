import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import { executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'

/**
 * Runs database migrations
 */
export function runDatabaseMigrations(): void {
  try {
    Logging.step('Migrating database schema to latest state...')
    executeCommand(`bun forge db push`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    Logging.success('Initial migration generated successfully.')
    executeCommand(`${PB_BINARY_PATH} migrate up ${PB_KWARGS.join(' ')}`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    Logging.success('Database schema migrated successfully.')
  } catch (error) {
    Logging.error(
      `Failed to generate initial migration: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}
