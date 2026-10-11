import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import { getRepoSlug, getTagCommit, updateRegistryIndex } from '@/utils/github'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import validateModuleAuthor from '../functions/validateModuleAuthor'
import validateModuleStructure from '../functions/validateModuleStructure'

/**
 * Publishes a module: bumps the version, commits + tags it in the module's Git
 * repo, pushes, and records the release commit in the GitHub-hosted index.
 *
 * Steps:
 * 1. Validates module structure (required files, package.json format)
 * 2. Validates author permissions (GitHub)
 * 3. Bumps version, commits, tags `v<version>`, and pushes
 * 4. Updates the registry index with `versions[v] = <commit sha>`
 */
export async function publishModuleHandler(moduleName: string): Promise<void> {
  const { shortName, targetDir } = normalizePackage(moduleName)
  const modulePath = path.join(ROOT_DIR, 'modules', moduleName)

  if (!fs.existsSync(targetDir) && !fs.existsSync(modulePath)) {
    logger.error(`Module ${chalk.blue(moduleName)} not found in modules/`)
    process.exit(1)
  }

  const dir = fs.existsSync(targetDir) ? targetDir : modulePath

  logger.debug('Validating module structure...')
  await validateModuleStructure(dir)

  logger.debug('Validating module author...')
  await validateModuleAuthor(dir)

  const { oldVersion, newVersion } = bumpPackageVersion(dir)

  logger.print(
    `  Version: ${chalk.dim(oldVersion)} ${chalk.dim('→')} ${chalk.green(newVersion)}`
  )

  logger.debug(`Publishing ${chalk.blue(shortName)}...`)

  try {
    executeCommand(`git add package.json`, { cwd: dir })
    executeCommand(`git commit -m "chore: release v${newVersion}"`, { cwd: dir })
    executeCommand(`git tag v${newVersion}`, { cwd: dir })
    executeCommand('git push', { cwd: dir })
    executeCommand('git push --tags', { cwd: dir })

    const repo = getRepoSlug(dir)

    const commitSha = getTagCommit(repo, `v${newVersion}`)

    logger.debug(`Updating registry index (${repo}@${commitSha.slice(0, 8)})...`)

    updateRegistryIndex('modules', {
      id: shortName,
      repo,
      version: newVersion,
      commitSha
    })

    logger.success(
      `Published ${chalk.blue(shortName)} ${chalk.dim(`v${newVersion}`)}`
    )
  } catch (error) {
    revertPackageVersion(dir, oldVersion)

    logger.error(`Publish failed for ${chalk.blue(shortName)}`)
    logger.debug(`Error: ${error}`)
    process.exit(1)
  }
}
