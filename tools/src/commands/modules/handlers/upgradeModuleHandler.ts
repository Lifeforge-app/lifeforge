import fs from 'fs'
import path from 'path'
import semver from 'semver'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'
import { getPackageLatestVersion } from '@/utils/registry'

import listModules from '../functions/listModules'
import generateRouteRegistry from '../functions/registry/generateRouteRegistry'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'

/**
 * Upgrades a single module to its latest registry version.
 *
 * Creates a backup before upgrading and restores it if the upgrade fails.
 *
 * @returns true if upgraded, false if already up to date or failed
 */
async function upgradeModule(
  packageName: string,
  currentVersion: string
): Promise<boolean> {
  const { fullName, targetDir } = normalizePackage(packageName)

  const latestVersion = await getPackageLatestVersion(fullName)

  if (!latestVersion) {
    Logging.warn(`Could not check registry for ${Logging.highlight(fullName)}`)

    return false
  }

  if (semver.eq(currentVersion, latestVersion)) {
    Logging.print(
      `  ${Logging.dim('•')} ${Logging.highlight(packageName)} ${Logging.dim(`v${currentVersion} is up to date`)}`
    )

    return false
  }

  Logging.debug(
    `Upgrading ${Logging.highlight(packageName)} from ${currentVersion} to ${latestVersion}...`
  )

  const backupPath = path.join(path.dirname(targetDir), `${packageName}.backup`)

  try {
    if (fs.existsSync(backupPath)) {
      fs.rmSync(backupPath, { recursive: true, force: true })
    }

    fs.cpSync(targetDir, backupPath, { recursive: true })
    fs.rmSync(targetDir, { recursive: true, force: true })

    installPackage(fullName, targetDir)

    fs.rmSync(backupPath, { recursive: true, force: true })

    Logging.print(
      `  ${Logging.green('↑')} ${Logging.highlight(packageName)} ${Logging.dim(`${currentVersion} →`)} ${Logging.green(latestVersion)}`
    )

    return true
  } catch (error) {
    Logging.error(`Failed to upgrade ${Logging.highlight(fullName)}: ${error}`)

    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, targetDir)
      Logging.debug('Restored backup after failed upgrade')
    }

    return false
  }
}

/**
 * Upgrades one or all installed modules to their latest versions.
 *
 * After successful upgrades:
 * - Regenerates route and schema registries
 * - Regenerates database migrations
 */
export async function upgradeModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  let upgradedCount = 0

  if (moduleName) {
    const { fullName } = normalizePackage(moduleName)

    const mod = modules[fullName]

    if (!mod) {
      Logging.actionableError(
        `Module ${Logging.highlight(moduleName)} is not installed`,
        'Run "bun forge modules list" to see installed modules'
      )
      process.exit(1)
    }

    const upgraded = await upgradeModule(fullName, mod.version)

    if (upgraded) {
      upgradedCount++
    }
  } else {
    Logging.print(
      `Checking ${Logging.highlight(String(Object.keys(modules).length))} modules for updates...\n`
    )

    for (const [name, { version }] of Object.entries(modules)) {
      const upgraded = await upgradeModule(name, version)

      if (upgraded) {
        upgradedCount++
      }
    }
  }

  if (upgradedCount > 0) {
    Logging.print('')
    Logging.debug('Regenerating registries...')

    generateRouteRegistry()
    generateSchemaRegistry()
    generateMigrationsHandler()

    Logging.success(
      `Upgraded ${Logging.highlight(String(upgradedCount))} module${upgradedCount > 1 ? 's' : ''}`
    )
  } else if (!moduleName) {
    Logging.print('')
    Logging.success('All modules are up to date')
  }
}
