import { getEnvVars } from '@/utils/helpers'
import initRouteAndSchemaFiles from '@/utils/initRouteAndSchemaFiles'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import { downloadPocketBaseBinary } from '../functions/database-initialization/download-pocketbase'
import { runDatabaseMigrations } from '../functions/database-initialization/migrations'
import {
  createPocketBaseSuperuser,
  validatePocketBaseNotInitialized
} from '../functions/database-initialization/superuser'

export async function initializeDatabaseHandler() {
  const { PB_EMAIL, PB_PASSWORD } = getEnvVars([
    'PB_EMAIL',
    'PB_PASSWORD',
    'MASTER_KEY'
  ])

  await downloadPocketBaseBinary()

  checkRunningPBInstances()
  validatePocketBaseNotInitialized()
  createPocketBaseSuperuser(PB_EMAIL, PB_PASSWORD)
  runDatabaseMigrations()
  initRouteAndSchemaFiles()

  CLILoggingService.success(
    'Setup process complete. You can now start the PocketBase server with `bun forge dev db`'
  )
}
