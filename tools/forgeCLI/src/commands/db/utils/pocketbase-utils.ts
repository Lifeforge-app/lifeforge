import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { PB_BINARY_PATH, PB_KWARGS, PB_MIGRATIONS_DIR } from '@/constants/db'
import CLILoggingService from '@/utils/logging'



/**
 * Cleans up old migrations
 */
export async function cleanupOldMigrations(
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.warn('Cleaning up old migrations directory...')

    if (!targetModule) {
      fs.rmSync(PB_MIGRATIONS_DIR, { recursive: true, force: true })
      execSync(
        `${PB_BINARY_PATH} migrate history-sync ${PB_KWARGS.join(' ')}`,
        {
          stdio: ['pipe', 'pipe', 'pipe']
        }
      )
    } else {
      const migrationFiles = fs.readdirSync(PB_MIGRATIONS_DIR)

      migrationFiles.forEach(file => {
        if (file.endsWith(`_${targetModule}.js`)) {
          fs.rmSync(path.join(PB_MIGRATIONS_DIR, file))
        }
      })

      execSync(
        `${PB_BINARY_PATH} migrate history-sync ${PB_KWARGS.join(' ')}`,
        {
          stdio: ['pipe', 'pipe', 'pipe']
        }
      )

      CLILoggingService.info(
        `Removed ${chalk.bold.blue(
          migrationFiles.filter(file => file.endsWith(`_${targetModule}.js`))
            .length
        )} old migrations for module ${chalk.bold.blue(targetModule)}.`
      )
    }
  } catch {
    // Migrations directory doesn't exist, no cleanup needed
  }
}
