import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import PocketBase from 'pocketbase'

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
    CLILoggingService.actionableError(
      'PocketBase directory does not exist.',
      'Have you accidentally removed or renamed the folder in your project named "database"? This is the default location specified by PB_DIR. If you plan to use a different location, please update the PB_DIR environment variable accordingly.'
    )
    process.exit(1)
  }

  try {
    fs.accessSync(pbInstancePath)
  } catch {
    CLILoggingService.actionableError(
      'PocketBase binary not found in the specified directory.',
      'The database folder is found, but the PocketBase binary is missing. Please ensure that PocketBase is correctly set up in the specified directory.'
    )
    process.exit(1)
  }

  return { pbInstancePath, pbDir: resolvedPbDir }
}

export default async function getPocketbaseInstance(): Promise<PocketBase> {
  const pb = new PocketBase(process.env.PB_HOST)

  try {
    await pb
      .collection('_superusers')
      .authWithPassword(process.env.PB_EMAIL!, process.env.PB_PASSWORD!)

    if (!pb.authStore.isSuperuser || !pb.authStore.isValid) {
      throw new Error('Invalid credentials or insufficient permissions')
    }

    return pb
  } catch (error) {
    CLILoggingService.error(
      `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
    process.exit(1)
  }
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
