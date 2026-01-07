import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'

import checkDockerReady from '../functions/checkDockerReady'

interface ReloadOptions {
  skipClient?: boolean
  skipMigrations?: boolean
}

/**
 * Orchestrates a full reload of Docker containers after module install/uninstall.
 *
 * Steps:
 * 1. Stop server container
 * 2. Run db-init to regenerate + apply migrations (unless skipped)
 * 3. Run client-builder to rebuild client (unless skipped)
 * 4. Restart server and client containers
 */
export async function reloadHandler(options: ReloadOptions): Promise<void> {
  // Pre-flight checks
  if (!checkDockerReady()) {
    process.exit(1)
  }

  const execOptions = { cwd: ROOT_DIR, stdio: 'inherit' as const }

  try {
    Logging.info('Starting Docker reload sequence...')

    // Step 1: Stop server
    Logging.info('Stopping server...')
    executeCommand('docker compose stop server', execOptions)

    // Step 2: Run migrations (unless skipped)
    if (!options.skipMigrations) {
      Logging.info('Regenerating and applying migrations...')
      executeCommand('docker compose run --rm db-init', execOptions)
    } else {
      Logging.info('Skipping migrations (--skip-migrations)')
    }

    // Step 3: Rebuild client (unless skipped)
    if (!options.skipClient) {
      Logging.info('Rebuilding client...')
      executeCommand('docker compose run --rm client-builder', execOptions)
    } else {
      Logging.info('Skipping client rebuild (--skip-client)')
    }

    // Step 4: Restart containers
    Logging.info('Restarting server and client...')
    executeCommand('docker compose up -d server client', execOptions)

    Logging.success('Docker reload complete!')
  } catch (error) {
    Logging.error('Docker reload failed')
    Logging.debug(
      `Error details: ${error instanceof Error ? error.message : String(error)}`
    )
    process.exit(1)
  }
}
