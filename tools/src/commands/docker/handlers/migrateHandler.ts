import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'

import checkDockerReady from '../functions/checkDockerReady'

interface MigrateOptions {
  skipMigrations?: boolean
}

/**
 * Runs database migrations after module install/uninstall in Docker deployments.
 *
 * Steps:
 * 1. Stop server container
 * 2. Run db-init to regenerate + apply migrations (unless skipped)
 * 3. Restart server container
 *
 * Note: Client rebuild is not needed because modules are loaded dynamically
 * via Module Federation - just refresh the browser after install/uninstall.
 */
export async function migrateHandler(options: MigrateOptions): Promise<void> {
  // Pre-flight checks
  if (!checkDockerReady()) {
    process.exit(1)
  }

  const execOptions = { cwd: ROOT_DIR, stdio: 'inherit' as const }

  try {
    logger.info('Starting Docker migration sequence...')

    // Step 1: Stop server
    logger.info('Stopping server...')
    executeCommand('docker compose stop server', execOptions)

    // Step 2: Run migrations (unless skipped)
    if (!options.skipMigrations) {
      logger.info('Regenerating and applying migrations...')
      executeCommand('docker compose run --rm db-init', execOptions)
    } else {
      logger.info('Skipping migrations (--skip-migrations)')
    }

    // Step 3: Restart server
    logger.info('Restarting server...')
    executeCommand('docker compose up -d server', execOptions)

    logger.success('Docker migration complete!')
    logger.info('Refresh the browser to load updated modules')
  } catch (error) {
    logger.error('Docker migration failed')
    logger.debug(
      `Error details: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
  }
}
