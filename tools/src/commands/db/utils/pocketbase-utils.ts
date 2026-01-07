import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { PB_BINARY_PATH, PB_KWARGS, PB_MIGRATIONS_DIR } from '@/constants/db'
import { isDockerMode } from '@/utils/helpers'
import Logging from '@/utils/logging'

/**
 * Cleans up old migrations.
 * In Docker mode, skips history-sync since PocketBase isn't running during init.
 */
export async function cleanupOldMigrations(
  targetModule?: string
): Promise<void> {
  try {
    Logging.debug('Cleaning up old migrations directory...')

    if (!targetModule) {
      fs.rmSync(PB_MIGRATIONS_DIR, { recursive: true, force: true })

      if (!isDockerMode()) {
        execSync(
          `${PB_BINARY_PATH} migrate history-sync ${PB_KWARGS.join(' ')}`,
          {
            stdio: ['pipe', 'pipe', 'pipe']
          }
        )
      }
    } else {
      const migrationFiles = fs.readdirSync(PB_MIGRATIONS_DIR)

      migrationFiles.forEach(file => {
        if (file.endsWith(`_${targetModule}.js`)) {
          fs.rmSync(path.join(PB_MIGRATIONS_DIR, file))
        }
      })

      if (!isDockerMode()) {
        execSync(
          `${PB_BINARY_PATH} migrate history-sync ${PB_KWARGS.join(' ')}`,
          {
            stdio: ['pipe', 'pipe', 'pipe']
          }
        )
      }

      const removedCount = migrationFiles.filter(file =>
        file.endsWith(`_${targetModule}.js`)
      ).length

      Logging.debug(
        `Removed ${Logging.highlight(String(removedCount))} old migrations for module ${Logging.highlight(targetModule)}.`
      )
    }
  } catch {
    // Migrations directory doesn't exist, no cleanup needed
  }
}
