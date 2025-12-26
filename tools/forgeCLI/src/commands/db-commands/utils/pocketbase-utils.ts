import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import PocketBase from 'pocketbase'

import { CLILoggingService } from '../../../utils/logging'
import { PB_BINARY_PATH, PB_DATA_DIR, PB_MIGRATIONS_DIR } from './constants'

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
  targetModule?: string
): Promise<void> {
  try {
    CLILoggingService.warn('Cleaning up old migrations directory...')

    if (!targetModule) {
      fs.rmSync(PB_MIGRATIONS_DIR, { recursive: true, force: true })
      execSync(
        `${PB_BINARY_PATH} migrate history-sync --dir=${PB_DATA_DIR} --migrationsDir=${PB_MIGRATIONS_DIR}`,
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
        `${PB_BINARY_PATH} migrate history-sync --dir=${PB_DATA_DIR} --migrationsDir=${PB_MIGRATIONS_DIR}`,
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
