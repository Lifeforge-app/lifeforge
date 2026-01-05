import fs from 'fs'

import { PB_BINARY_PATH, PB_DATA_DIR, PB_KWARGS } from '@/constants/db'
import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'

/**
 * Validates that PocketBase data directory doesn't already exist
 */
export function validatePocketBaseNotInitialized(
  exitOnFailure: boolean = true
): boolean {
  const pbInitialized = fs.existsSync(PB_DATA_DIR)

  if (pbInitialized && exitOnFailure) {
    Logging.actionableError(
      `PocketBase is already initialized in ${Logging.highlight(PB_DATA_DIR)}, aborting.`,
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
  Logging.debug(`Creating superuser with email ${Logging.highlight(email)}...`)

  try {
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

    Logging.success('Created superuser')
  } catch (error) {
    Logging.actionableError(
      `Failed to create superuser: ${error instanceof Error ? error.message : 'Unknown error'}`,
      'Check your PocketBase configuration and try again'
    )
    process.exit(1)
  }
}
