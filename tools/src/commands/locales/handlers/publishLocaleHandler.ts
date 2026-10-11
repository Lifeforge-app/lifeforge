import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'

import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import { getRepoSlug, getTagCommit, updateRegistryIndex } from '@/utils/github'
import { assertKebabRepo } from '@/utils/kebab'
import normalizePackage from '@/utils/normalizePackage'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import validateLocalesAuthor from '../functions/validateLocalesAuthor'
import { validateLocaleStructureHandler } from './validateLocaleStructure'

/**
 * Publishes a language pack: bumps the version, commits + tags it in the
 * locale's Git repo, pushes, and records the release commit in the index.
 */
export async function publishLocaleHandler(langCode: string): Promise<void> {
  const { shortName, targetDir } = normalizePackage(langCode, 'locale')

  if (!fs.existsSync(targetDir)) {
    log.error(`Locale "${langCode}" not found in locales/`)

    process.exit(1)
  }

  log.step('Validating locale structure...')
  validateLocaleStructureHandler(langCode)

  await validateLocalesAuthor(targetDir)

  const { oldVersion, newVersion } = bumpPackageVersion(targetDir)

  log.step(
    `Bumped version: ${chalk.blue(oldVersion)} → ${chalk.blue(newVersion)}`
  )

  startSpinner(`Publishing ${chalk.blue(shortName)}...`)

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

    stopSpinner(`Published ${chalk.blue(shortName)}`)
  } catch {
    revertPackageVersion(targetDir, oldVersion)

    failSpinner(`Failed to publish ${chalk.blue(shortName)}`)
    process.exit(1)
  }
}
