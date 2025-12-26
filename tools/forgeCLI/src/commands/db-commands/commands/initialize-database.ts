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

export async function initializeDatabaseHandler(
  email: string,
  password: string
) {
  const envPath = ensureEnvironmentFile()

  checkRunningPBInstances()
  validatePocketBaseNotInitialized()
  createPocketBaseSuperuser(email, password)
  runDatabaseMigrations()
  await updateEnvironmentFile(envPath, email, password)
  validateEnvironment(['PB_HOST', 'PB_EMAIL', 'PB_PASSWORD'])

  const pbPid = await startPocketBaseAndGetPid()

  await setupDefaultData(email, password)
  completeInitialization(pbPid)
}
