import fs from 'fs'

import { PB_MIGRATIONS_DIR } from '@/constants/db'
import logger from '@/utils/logger'

/**
 * Cleans up old migrations
 */
export async function cleanupOldMigrations(): Promise<void> {
  try {
    logger.debug('Cleaning up old migrations directory...')

    fs.rmSync(PB_MIGRATIONS_DIR, { recursive: true, force: true })
  } catch {
    // Migrations directory doesn't exist, no cleanup needed
  }
}
