import {
  checkRunningPBInstances,
  validateEnvironment
} from '../../../utils/helpers'
import {
  completeInitialization,
  createPocketBaseSuperuser,
  ensureEnvironmentFile,
  runDatabaseMigrations,
  setupDefaultData,
  startPocketBaseAndGetPid,
  updateEnvironmentFile,
  validatePocketBaseNotInitialized
} from '../functions/database-initialization'
import { validatePocketBaseSetup } from '../utils'

export async function initializeDatabaseHandler(
  email: string,
  password: string
) {
  const envPath = ensureEnvironmentFile()

  validateEnvironment(['PB_DIR'])

  const { pbInstancePath, pbDir } = await validatePocketBaseSetup(
    process.env.PB_DIR!
  )

  checkRunningPBInstances()
  validatePocketBaseNotInitialized(pbDir)
  createPocketBaseSuperuser(pbInstancePath, email, password)
  runDatabaseMigrations(pbInstancePath)
  await updateEnvironmentFile(envPath, email, password)
  validateEnvironment(['PB_HOST', 'PB_EMAIL', 'PB_PASSWORD'])

  const pbPid = await startPocketBaseAndGetPid(pbInstancePath)

  await setupDefaultData(email, password)
  completeInitialization(pbPid)
}
