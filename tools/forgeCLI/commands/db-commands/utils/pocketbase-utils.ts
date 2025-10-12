import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { CLILoggingService } from '../../../utils/logging'
import type { Environment } from './types'

/**
 * PocketBase migration utilities
 */

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
 * Checks for running PocketBase instances
 */
export function checkRunningInstances(): void {
  try {
    const pbInstanceNumber = execSync("pgrep -f 'pocketbase serve'")
      .toString()
      .trim()

    if (pbInstanceNumber) {
      CLILoggingService.error(
        `PocketBase is already running (PID: ${pbInstanceNumber}). Please stop the existing instance before running the migration script.`
      )
      process.exit(1)
    }
  } catch {
    // No existing instance found, continue with the script
  }
}

/**
 * Cleans up old migrations
 */
export async function cleanupOldMigrations(
  pbDir: string,
  pbInstancePath: string
): Promise<void> {
  const migrationsPath = path.resolve(pbDir, 'pb_migrations')

  try {
    fs.accessSync(migrationsPath)
    CLILoggingService.warn('Cleaning up old migrations directory...')
    fs.rmSync(migrationsPath, { recursive: true, force: true })
    execSync(`${pbInstancePath} migrate history-sync`, {
      stdio: ['pipe', 'pipe', 'pipe']
    })
  } catch {
    // Migrations directory doesn't exist, no cleanup needed
  }
}
