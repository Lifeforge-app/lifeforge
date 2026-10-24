import { log } from '@clack/prompts'
import chalk from 'chalk'

import bumpPackageVersion, {
  revertPackageVersion
} from '@/utils/bumpPackageVersion'
import executeCommand from '@/utils/commands'
import { getTagCommit, updateRegistryIndex } from '@/utils/github'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import { resolveModule } from '../functions/listModules'
import validateModuleAuthor from '../functions/validateModuleAuthor'
import validateModuleRepo from '../functions/validateModuleRepo'
import validateModuleStructure from '../functions/validateModuleStructure'

/**
 * Publishes a module: bumps the version, commits + tags it in the module's Git
 * repo, pushes, and records the release commit in the GitHub-hosted index.
 *
 * Steps:
 * 1. Validates module structure (required files, package.json format)
 * 2. Validates author permissions (GitHub)
 * 3. Validates the target repo (repo URL, dash-case name, reachability, upstream)
 * 4. Bumps version, commits, tags `v<version>`, and pushes
 * 5. Updates the registry index with `versions[v] = <commit sha>`
 */
export async function publishModuleHandler(moduleName: string): Promise<void> {
  const mod = resolveModule(moduleName)

  if (!mod) {
    log.error(`Module ${chalk.blue(moduleName)} not found in modules/`)
    process.exit(1)
  }

  const { id: shortName, dir } = mod

  await validateModuleStructure(dir)

  await validateModuleAuthor(dir)

  const repo = validateModuleRepo(dir)

  const { oldVersion, newVersion } = bumpPackageVersion(dir)

  log.message(
    `  Version: ${chalk.dim(oldVersion)} ${chalk.dim('→')} ${chalk.green(newVersion)}`
  )

  startSpinner(`Publishing ${chalk.blue(shortName)}...`)

  try {
    executeCommand(`git add package.json`, { cwd: dir })
    executeCommand(`git commit -m "chore: release v${newVersion}"`, {
      cwd: dir
    })
    executeCommand(`git tag v${newVersion}`, { cwd: dir })
    executeCommand('git push', { cwd: dir })
    executeCommand('git push --tags', { cwd: dir })

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
  } catch (error) {
    revertPackageVersion(dir, oldVersion)

    failSpinner(`Publish failed for ${chalk.blue(shortName)}`)

    log.error(
      error instanceof Error ? error.message : `Command failed: ${String(error)}`
    )

    process.exit(1)
  }
}
