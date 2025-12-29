import { ensureEnvExists } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import {
  createPocketBaseSuperuser,
  downloadPocketBaseBinary,
  runDatabaseMigrations,
  setupDefaultData,
  validatePocketBaseNotInitialized
} from '../functions/database-initialization'

export async function initializeDatabaseHandler() {
  ensureEnvExists(['PB_HOST', 'PB_EMAIL', 'PB_PASSWORD', 'MASTER_KEY'])

  const email = process.env.PB_EMAIL!

  const password = process.env.PB_PASSWORD!

  await downloadPocketBaseBinary()

  checkRunningPBInstances()
  validatePocketBaseNotInitialized()
  createPocketBaseSuperuser(email, password)
  runDatabaseMigrations()

  await setupDefaultData(email, password)

  CLILoggingService.success(
    'PocketBase server stopped, setup process complete.'
  )
  CLILoggingService.info(
    'You can now start the PocketBase server with `bun forge dev db`'
  )
}
