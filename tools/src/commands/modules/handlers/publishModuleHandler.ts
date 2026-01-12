import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import logger from '@/utils/logger'

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
    logger.actionableError(
      `Module ${chalk.blue(moduleName)} not found in apps/`,
      'Make sure the module exists in the apps directory'
    )
    process.exit(1)
  }

  logger.debug('Validating module structure...')
  await validateModuleStructure(modulePath)

  logger.debug('Validating module author...')
  await validateModuleAuthor(modulePath)

  const { oldVersion, newVersion } = bumpPackageVersion(modulePath)

  logger.print(
    `  Version: ${chalk.dim(oldVersion)} ${chalk.dim('→')} ${chalk.green(newVersion)}`
  )

  logger.debug(`Publishing ${chalk.blue(moduleName)}...`)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: modulePath,
      stdio: 'pipe'
    })

    logger.success(
      `Published ${chalk.blue(moduleName)} ${chalk.dim(`v${newVersion}`)}`
    )
  } catch (error) {
    revertPackageVersion(modulePath, oldVersion)

    logger.actionableError(
      `Publish failed for ${chalk.blue(moduleName)}`,
      'Check npm authentication and try again'
    )
    logger.debug(`Error: ${error}`)
    process.exit(1)
  }
}
