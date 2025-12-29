import chalk from 'chalk'
import fs from 'fs'

import { PB_BINARY_PATH, PB_DATA_DIR, PB_KWARGS } from '@/constants/db'
import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import { startPocketbase } from '@/utils/pocketbase'

import getPocketbaseInstance from '../../utils/pocketbase-utils'

/**
 * Validates that PocketBase data directory doesn't already exist
 */
export function validatePocketBaseNotInitialized(): void {
  if (fs.existsSync(PB_DATA_DIR)) {
    CLILoggingService.actionableError(
      `PocketBase is already initialized in ${PB_DATA_DIR}, aborting.`,
      'If you want to re-initialize, please remove the existing pb_data folder in the database directory.'
    )
    process.exit(1)
  }
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

/**
 * Sets up default data in the database
 */
export async function setupDefaultData(
  email: string,
  password: string
): Promise<void> {
  const killPB = await startPocketbase()

  const pb = await getPocketbaseInstance()

  CLILoggingService.step(
    'Pocketbase instance acquired, setting up default data...'
  )

  try {
    // Create default user
    const usersCollection = pb.collection('users')

    await usersCollection.create({
      email,
      password,
      passwordConfirm: password,
      verified: true,
      username: email.split('@')[0],
      name: 'Admin User',
      theme: 'system',
      language: 'en',
      fontScale: 1.0,
      borderRadiusMultiplier: 1.0
    })

    CLILoggingService.success('Default data setup completed successfully.')
    killPB?.()
  } catch (error) {
    CLILoggingService.error(
      `Failed to set up default data: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    )
    killPB?.()
    process.exit(1)
  }
}
