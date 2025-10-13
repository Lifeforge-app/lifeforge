import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { CLILoggingService } from '../../../utils/logging'

/**
 * Validates PocketBase setup and returns paths
 */
export async function validatePocketBaseSetup(pbDir: string): Promise<{
  pbInstancePath: string
  pbDir: string
}> {
  const resolvedPbDir = path.resolve(pbDir)

  const pbInstancePath = path.resolve(resolvedPbDir, 'pocketbase')

  try {
    fs.accessSync(resolvedPbDir)
  } catch {
    CLILoggingService.error('PocketBase directory does not exist')
    process.exit(1)
  }

  try {
    fs.accessSync(pbInstancePath)
  } catch {
    CLILoggingService.error(
      'PocketBase binary not found in the specified directory'
    )
    process.exit(1)
  }

  return { pbInstancePath, pbDir: resolvedPbDir }
}

/**
 * Cleans up old migrations
 */
export async function cleanupOldMigrations(
  pbDir: string,
  pbInstancePath: string,
  targetModule?: string
): Promise<void> {
  const migrationsPath = path.resolve(pbDir, 'pb_migrations')

  try {
    fs.accessSync(migrationsPath)
    CLILoggingService.warn('Cleaning up old migrations directory...')

    if (!targetModule) {
      fs.rmSync(migrationsPath, { recursive: true, force: true })
      execSync(`${pbInstancePath} migrate history-sync`, {
        stdio: ['pipe', 'pipe', 'pipe']
      })
    } else {
      const migrationFiles = fs.readdirSync(migrationsPath)

      migrationFiles.forEach(file => {
        if (file.endsWith(`_${targetModule}.js`)) {
          fs.rmSync(path.join(migrationsPath, file))
        }
      })

      execSync(`${pbInstancePath} migrate history-sync`, {
        stdio: ['pipe', 'pipe', 'pipe']
      })

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
