import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'

import bumpPackageVersion, {
  revertPackageVersion
} from '../../../utils/bumpPackageVersion'
import { getRegistryUrl } from '../../../utils/registry'
import validateModuleAuthor from '../functions/validateModuleAuthor'
import validateModuleStructure from '../functions/validateModuleStructure'

/**
 * Publishes a module to the registry.
 *
 * Steps:
 * 1. Validates module structure (required files, package.json format)
 * 2. Validates author permissions
 * 3. Bumps version in package.json
 * 4. Publishes to npm registry
 * 5. Reverts version on failure
 */
export async function publishModuleHandler(moduleName: string): Promise<void> {
  const modulePath = path.join(ROOT_DIR, 'apps', moduleName)

  if (!fs.existsSync(modulePath)) {
    Logging.actionableError(
      `Module ${Logging.highlight(moduleName)} not found in apps/`,
      'Make sure the module exists in the apps directory'
    )
    process.exit(1)
  }

  Logging.debug('Validating module structure...')
  await validateModuleStructure(modulePath)

  Logging.debug('Validating module author...')
  await validateModuleAuthor(modulePath)

  const { oldVersion, newVersion } = bumpPackageVersion(modulePath)

  Logging.print(
    `  Version: ${Logging.dim(oldVersion)} ${Logging.dim('→')} ${Logging.green(newVersion)}`
  )

  Logging.debug(`Publishing ${Logging.highlight(moduleName)}...`)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: modulePath,
      stdio: 'pipe'
    })

    Logging.success(
      `Published ${Logging.highlight(moduleName)} ${Logging.dim(`v${newVersion}`)}`
    )
  } catch (error) {
    revertPackageVersion(modulePath, oldVersion)

    Logging.actionableError(
      `Publish failed for ${Logging.highlight(moduleName)}`,
      'Check npm authentication and try again'
    )
    Logging.debug(`Error: ${error}`)
    process.exit(1)
  }
}
