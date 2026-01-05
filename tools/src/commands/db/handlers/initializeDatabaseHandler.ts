import { getEnvVars } from '@/utils/helpers'
import Logging from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

import { downloadPocketBaseBinary } from '../functions/database-initialization/download-pocketbase'
import {
  createPocketBaseSuperuser,
  validatePocketBaseNotInitialized
} from '../functions/database-initialization/superuser'
import { generateMigrationsHandler } from './generateMigrationsHandler'

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

  generateMigrationsHandler()

  Logging.success('Database initialized successfully')
}
