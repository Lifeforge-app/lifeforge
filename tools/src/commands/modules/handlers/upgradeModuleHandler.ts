import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import semver from 'semver'

import { isDockerMode } from '@/utils/helpers'
import { installFromGithub } from '@/utils/installSource'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import normalizePackage from '@/utils/normalizePackage'
import { resolveEntry } from '@/utils/registryIndex'
import { resolveModuleSchemaFile, syncModuleSchema } from '@/utils/schema'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import cleanModuleSource from '../functions/cleanModuleSource'
import listModules from '../functions/listModules'
import { buildModuleHandler } from './buildModuleHandler'

interface UpgradeResult {
  version: string
  repo: string
  commitSha: string
}

/**
 * Upgrades a single module to its latest registry version.
 *
 * Creates a backup before upgrading and restores it if the upgrade fails.
 *
 * @returns the upgrade result, or `false` if already up to date / failed
 */
async function upgradeModule(
  packageName: string,
  currentVersion: string
): Promise<UpgradeResult | false> {
  const { shortName, targetDir } = normalizePackage(packageName)

  const entry = await resolveEntry('modules', shortName)

  if (!entry) {
    log.warn(`Could not find ${chalk.blue(shortName)} in the registry`)

    return false
  }

  const latestVersion = entry.latest
  const commitSha = entry.versions[latestVersion]

  if (!commitSha) {
    log.warn(
      `Registry has no release commit for ${chalk.blue(shortName)}@${latestVersion}`
    )

    return false
  }

  if (semver.eq(currentVersion, latestVersion)) {
    log.message(
      `  ${chalk.dim('•')} ${chalk.blue(shortName)} ${chalk.dim(`v${currentVersion} is up to date`)}`
    )

    return false
  }

  verifyLocked('modules', shortName, latestVersion, commitSha)

  const backupPath = path.join(
    path.dirname(targetDir),
    `${shortName}.backup`
  )

  startSpinner(`Upgrading ${chalk.blue(shortName)}...`)

  try {
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true })
    }

    fs.cpSync(targetDir, backupPath, { recursive: true })
    fs.rmSync(targetDir, { recursive: true, force: true })

    await installFromGithub({
      kind: 'modules',
      id: shortName,
      entry,
      targetDir,
      version: latestVersion
    })

    fs.rmSync(backupPath, { recursive: true, force: true })

    stopSpinner(
      `  ${chalk.green('↑')} ${chalk.blue(shortName)} ${chalk.dim(`${currentVersion} →`)} ${chalk.green(latestVersion)}`
    )

    return { version: latestVersion, repo: entry.repo, commitSha }
  } catch {
    failSpinner(`Failed to upgrade ${chalk.blue(shortName)}.`)

    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, targetDir)
    }

    return false
  }
}

/**
 * Upgrades one or all installed modules to their latest versions.
 *
 * After successful upgrades:
 * - Builds module client bundles for federation (both dist and dist-docker)
 * - Pushes the database schema if a schema exists
 * - Removes source and updates the lockfile
 */
export async function upgradeModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  const upgraded: { id: string; result: UpgradeResult }[] = []

  if (moduleName) {
    const { fullName } = normalizePackage(moduleName)

    const mod = modules[fullName]

    if (!mod) {
      log.error(`Module ${chalk.blue(moduleName)} is not installed`)
      process.exit(1)
    }

    const result = await upgradeModule(fullName, mod.version)

    if (result) {
      upgraded.push({
        id: fullName.replace('@lifeforge/', ''),
        result
      })
    }
  } else {
    log.message(
      `Checking ${chalk.blue(String(Object.keys(modules).length))} modules for updates...\n`
    )

    for (const [name, { version }] of Object.entries(modules)) {
      const result = await upgradeModule(name, version)

      if (result) {
        upgraded.push({ id: name.replace('@lifeforge/', ''), result })
      }
    }
  }

  if (upgraded.length === 0) {
    if (!moduleName) {
      log.message('')
      log.success('All modules are up to date')
    }

    return
  }

  // Build module client bundles for federation (both dist and dist-docker)
  for (const { id } of upgraded) {
    await buildModuleHandler(id)

    await buildModuleHandler(id, { docker: true, buildServer: false })
  }

  // Sync the database schema for upgraded modules (only their own objects)
  if (!isDockerMode()) {
    for (const { id } of upgraded) {
      const { targetDir } = normalizePackage(id)

      if (!resolveModuleSchemaFile(targetDir)) {
        continue
      }

      startSpinner(`Syncing database schema for ${chalk.blue(id)}...`)

      try {
        await syncModuleSchema(targetDir)
        stopSpinner(`Synced database schema for ${chalk.blue(id)}`)
      } catch {
        failSpinner(
          `Could not sync the database schema for ${id} automatically.`
        )
      }
    }
  }

  // Clean source code (upgrades always run in production mode)
  for (const { id } of upgraded) {
    cleanModuleSource(normalizePackage(id).targetDir)
  }

  for (const { id, result } of upgraded) {
    setLocked('modules', id, {
      repo: result.repo,
      version: result.version,
      commitSha: result.commitSha
    })
  }

  log.step('Source code removed. Only built bundles retained.')

  log.success(
    `Upgraded ${chalk.blue(String(upgraded.length))} module${upgraded.length > 1 ? 's' : ''}`
  )
}
