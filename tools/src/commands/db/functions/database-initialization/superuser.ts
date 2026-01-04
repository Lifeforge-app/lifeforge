import chalk from 'chalk'
import fs from 'fs'

import { PB_BINARY_PATH, PB_DATA_DIR, PB_KWARGS } from '@/constants/db'
import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

/**
 * Validates that PocketBase data directory doesn't already exist
 */
export function validatePocketBaseNotInitialized(
  exitOnFailure: boolean = true
): boolean {
  const pbInitialized = fs.existsSync(PB_DATA_DIR)

  if (pbInitialized && exitOnFailure) {
    CLILoggingService.actionableError(
      `PocketBase is already initialized in ${PB_DATA_DIR}, aborting.`,
      'If you want to re-initialize, please remove the existing pb_data folder in the database directory.'
    )
    process.exit(1)
  }

  return pbInitialized
}

/**
 * Creates PocketBase superuser
 */
export function createPocketBaseSuperuser(
  email: string,
  password: string
): void {
  try {
    CLILoggingService.step(
      `Initializing PocketBase database for ${chalk.bold.blue(email)}`
    )

    const result = executeCommand(
      `${PB_BINARY_PATH} superuser create ${PB_KWARGS.join(' ')}`,
      {
        stdio: ['pipe', 'pipe', 'pipe']
      },
      [email, password]
    )

    if (result.startsWith('Error:')) {
      throw new Error(result.replace(/^Error:\s*/, ''))
    }

    CLILoggingService.success(
      'PocketBase initialized and superuser created successfully.'
    )
  } catch (error) {
    CLILoggingService.error(
      `Failed to create superuser: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    process.exit(1)
  }
}
