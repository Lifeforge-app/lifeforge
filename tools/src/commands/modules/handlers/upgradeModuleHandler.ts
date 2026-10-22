import { log } from '@clack/prompts'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import semver from 'semver'

import {
  resolveModuleSchemaFile,
  syncModuleSchema
} from '@/commands/db/functions/schema'
import { isDockerMode } from '@/utils/helpers'
import initGitRepository from '@/utils/initGitRepository'
import { installFromGithub } from '@/utils/installSource'
import { setLocked, verifyLocked } from '@/utils/moduleLock'
import { resolveEntry } from '@/utils/registryIndex'
import { failSpinner, startSpinner, stopSpinner } from '@/utils/spinner'

import cleanModuleSource from '../functions/cleanModuleSource'
import listModules, {
  type ModuleBasicInfo,
  resolveModule
} from '../functions/listModules'
import { buildModuleHandler } from './buildModuleHandler'

interface UpgradeResult {
  version: string
  repo: string
  commitSha: string
  isDevMode: boolean
}

/**
 * Upgrades a single module to its latest registry version.
 *
 * Creates a backup before upgrading and restores it if the upgrade fails.
 *
 * @returns the upgrade result, or `false` if already up to date / failed
 */
async function upgradeModule(
  mod: ModuleBasicInfo,
  currentVersion: string
): Promise<UpgradeResult | false> {
  const { id: shortName, dir: targetDir } = mod

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

  const isDevMode = fs.existsSync(path.join(targetDir, '.git'))

  const backupPath = path.join(path.dirname(targetDir), `${shortName}.backup`)

  startSpinner(`Upgrading ${chalk.blue(shortName)}...`)

  try {
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true })
    }

    fs.cpSync(targetDir, backupPath, { recursive: true })
    fs.rmSync(targetDir, { recursive: true, force: true })

    await installFromGithub({
      id: shortName,
      entry,
      targetDir,
      version: latestVersion
    })

    if (isDevMode) {
      initGitRepository(targetDir)
    }

    fs.rmSync(backupPath, { recursive: true, force: true })

    stopSpinner(
      `  ${chalk.green('↑')} ${chalk.blue(shortName)} ${chalk.dim(`${currentVersion} →`)} ${chalk.green(latestVersion)}`
    )

    return { version: latestVersion, repo: entry.repo, commitSha, isDevMode }
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
  const upgraded: { mod: ModuleBasicInfo; result: UpgradeResult }[] = []

  if (moduleName) {
    const mod = resolveModule(moduleName)

    if (!mod) {
      log.error(`Module ${chalk.blue(moduleName)} is not installed`)
      process.exit(1)
    }

    const result = await upgradeModule(mod, mod.version)

    if (result) {
      upgraded.push({ mod, result })
    }
  } else {
    const modules = Object.values(listModules())

    log.message(
      `Checking ${chalk.blue(String(modules.length))} modules for updates...\n`
    )

    for (const mod of modules) {
      const result = await upgradeModule(mod, mod.version)

      if (result) {
        upgraded.push({ mod, result })
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
  for (const { mod } of upgraded) {
    await buildModuleHandler(mod.id)

    await buildModuleHandler(mod.id, { docker: true, buildServer: false })
  }

  // Sync the database schema for upgraded modules (only their own objects)
  if (!isDockerMode()) {
    for (const { mod } of upgraded) {
      if (!resolveModuleSchemaFile(mod.dir)) {
        continue
      }

      startSpinner(`Syncing database schema for ${chalk.blue(mod.id)}...`)

      try {
        await syncModuleSchema(mod.dir)
        stopSpinner(`Synced database schema for ${chalk.blue(mod.id)}`)
      } catch {
        failSpinner(
          `Could not sync the database schema for ${mod.id} automatically.`
        )
      }
    }
  }

  // Clean source code for production modules (dev modules keep their source)
  for (const { mod, result } of upgraded) {
    if (!result.isDevMode) {
      cleanModuleSource(mod.dir)
    }
  }

  for (const { mod, result } of upgraded) {
    setLocked('modules', mod.id, {
      repo: result.repo,
      version: result.version,
      commitSha: result.commitSha
    })
  }

  if (upgraded.some(({ result }) => !result.isDevMode)) {
    log.step('Source code removed. Only built bundles retained.')
  }

  log.success(
    `Upgraded ${chalk.blue(String(upgraded.length))} module${upgraded.length > 1 ? 's' : ''}`
  )
}
