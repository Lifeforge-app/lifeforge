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
 * Renames .gitignore to gitignore before publish (npm excludes .gitignore).
 * Returns true if a rename was performed.
 */
function prepareGitignoreForPublish(modulePath: string): boolean {
  const gitignorePath = path.join(modulePath, '.gitignore')

  const renamedPath = path.join(modulePath, 'gitignore')

  if (fs.existsSync(gitignorePath)) {
    fs.renameSync(gitignorePath, renamedPath)

    return true
  }

  return false
}

/**
 * Restores gitignore back to .gitignore after publish.
 */
function restoreGitignoreAfterPublish(modulePath: string): void {
  const gitignorePath = path.join(modulePath, '.gitignore')

  const renamedPath = path.join(modulePath, 'gitignore')

  if (fs.existsSync(renamedPath)) {
    fs.renameSync(renamedPath, gitignorePath)
  }
}

/**
 * Publishes a module to the registry.
 *
 * Steps:
 * 1. Validates module structure (required files, package.json format)
 * 2. Validates author permissions
 * 3. Bumps version in package.json
 * 4. Renames .gitignore to gitignore (npm excludes .gitignore)
 * 5. Publishes to npm registry
 * 6. Restores gitignore to .gitignore
 * 7. Reverts version on failure
 */
export async function publishModuleHandler(moduleName: string): Promise<void> {
  const modulePath = path.join(ROOT_DIR, 'apps', moduleName)

  if (!fs.existsSync(modulePath)) {
    logger.error(`Module ${chalk.blue(moduleName)} not found in apps/`)
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

  // Rename .gitignore to gitignore (npm excludes .gitignore by default)
  const gitignoreRenamed = prepareGitignoreForPublish(modulePath)

  logger.debug(`Publishing ${chalk.blue(moduleName)}...`)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: modulePath
    })

    logger.success(
      `Published ${chalk.blue(moduleName)} ${chalk.dim(`v${newVersion}`)}`
    )
  } catch (error) {
    revertPackageVersion(modulePath, oldVersion)

    logger.error(`Publish failed for ${chalk.blue(moduleName)}`)
    logger.debug(`Error: ${error}`)
    process.exit(1)
  } finally {
    // Always restore .gitignore after publish attempt
    if (gitignoreRenamed) {
      restoreGitignoreAfterPublish(modulePath)
    }
  }
}
