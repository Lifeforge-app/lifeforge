import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/utils/constants'
import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import { getRepoSlug, getTagCommit, updateRegistryIndex } from '@/utils/github'
import { assertKebabRepo } from '@/utils/kebab'
import normalizePackage from '@/utils/normalizePackage'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

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
    log.error(`Module ${chalk.blue(moduleName)} not found in modules/`)
    process.exit(1)
  }

  const dir = fs.existsSync(targetDir) ? targetDir : modulePath

  await validateModuleStructure(dir)

  await validateModuleAuthor(dir)

  const { oldVersion, newVersion } = bumpPackageVersion(dir)

  log.message(
    `  Version: ${chalk.dim(oldVersion)} ${chalk.dim('→')} ${chalk.green(newVersion)}`
  )

  startSpinner(`Publishing ${chalk.blue(shortName)}...`)

  try {
    executeCommand(`git add package.json`, { cwd: dir })
    executeCommand(`git commit -m "chore: release v${newVersion}"`, { cwd: dir })
    executeCommand(`git tag v${newVersion}`, { cwd: dir })
    executeCommand('git push', { cwd: dir })
    executeCommand('git push --tags', { cwd: dir })

    const repo = getRepoSlug(dir)

    assertKebabRepo(repo)

    const commitSha = getTagCommit(repo, `v${newVersion}`)

    updateRegistryIndex('modules', {
      id: shortName,
      repo,
      version: newVersion,
      commitSha
    })

    stopSpinner(
      `Published ${chalk.blue(shortName)} ${chalk.dim(`v${newVersion}`)}`
    )
  } catch {
    revertPackageVersion(dir, oldVersion)

    failSpinner(`Publish failed for ${chalk.blue(shortName)}`)
    process.exit(1)
  }
}
