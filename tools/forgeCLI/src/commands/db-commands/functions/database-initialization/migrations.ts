import { PB_BINARY_PATH, PB_KWARGS } from '@/constants/db'
import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

/**
 * Runs database migrations
 */
export function runDatabaseMigrations(): void {
  try {
    CLILoggingService.step('Migrating database schema to latest state...')
    executeCommand(`bun forge db push`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.success('Initial migration generated successfully.')
    executeCommand(`${PB_BINARY_PATH} migrate up ${PB_KWARGS.join(' ')}`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.success('Database schema migrated successfully.')
  } catch (error) {
    CLILoggingService.error(
      `Failed to generate initial migration: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}
