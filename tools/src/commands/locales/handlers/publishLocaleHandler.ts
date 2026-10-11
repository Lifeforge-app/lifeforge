import chalk from 'chalk'
import fs from 'fs'

import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import { getRepoSlug, getTagCommit, updateRegistryIndex } from '@/utils/github'
import { assertKebabRepo } from '@/utils/kebab'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'

import validateLocalesAuthor from '../functions/validateLocalesAuthor'
import { validateLocaleStructureHandler } from './validateLocaleStructure'

/**
 * Publishes a language pack: bumps the version, commits + tags it in the
 * locale's Git repo, pushes, and records the release commit in the index.
 */
export async function publishLocaleHandler(langCode: string): Promise<void> {
  const { shortName, targetDir } = normalizePackage(langCode, 'locale')

  if (!fs.existsSync(targetDir)) {
    logger.error(`Locale "${langCode}" not found in locales/`)

    process.exit(1)
  }

  logger.info('Validating locale structure...')
  validateLocaleStructureHandler(langCode)

  logger.debug('Validating locale author...')
  await validateLocalesAuthor(targetDir)

  const { oldVersion, newVersion } = bumpPackageVersion(targetDir)

  logger.info(
    `Bumped version: ${chalk.blue(oldVersion)} → ${chalk.blue(newVersion)}`
  )

  logger.info(`Publishing ${chalk.blue(shortName)}...`)

  try {
    executeCommand('git add package.json', { cwd: targetDir })
    executeCommand(`git commit -m "chore: release v${newVersion}"`, {
      cwd: targetDir
    })
    executeCommand(`git tag v${newVersion}`, { cwd: targetDir })
    executeCommand('git push', { cwd: targetDir })
    executeCommand('git push --tags', { cwd: targetDir })

    const repo = getRepoSlug(targetDir)

    assertKebabRepo(repo)

    const commitSha = getTagCommit(repo, `v${newVersion}`)

    updateRegistryIndex('locales', {
      id: shortName,
      repo,
      version: newVersion,
      commitSha
    })

    logger.success(`Published ${chalk.blue(shortName)}`)
  } catch (error) {
    revertPackageVersion(targetDir, oldVersion)

    logger.error(`Failed to publish ${chalk.blue(shortName)}`)
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  }
}
