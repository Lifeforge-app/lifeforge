import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import semver from 'semver'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'
import { getPackageLatestVersion } from '@/utils/registry'

import listModules from '../functions/listModules'
import { buildModuleHandler } from './buildModuleHandler'

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
    logger.warn(`Could not check registry for ${chalk.blue(fullName)}`)

    return false
  }

  if (semver.eq(currentVersion, latestVersion)) {
    logger.print(
      `  ${chalk.dim('•')} ${chalk.blue(packageName)} ${chalk.dim(`v${currentVersion} is up to date`)}`
    )

    return false
  }

  logger.debug(
    `Upgrading ${chalk.blue(packageName)} from ${currentVersion} to ${latestVersion}...`
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

    logger.print(
      `  ${chalk.green('↑')} ${chalk.blue(packageName)} ${chalk.dim(`${currentVersion} →`)} ${chalk.green(latestVersion)}`
    )

    return true
  } catch (error) {
    logger.error(`Failed to upgrade ${chalk.blue(fullName)}: ${error}`)

    if (fs.existsSync(backupPath)) {
      fs.renameSync(backupPath, targetDir)
      logger.debug('Restored backup after failed upgrade')
    }

    return false
  }
}

/**
 * Upgrades one or all installed modules to their latest versions.
 *
 * After successful upgrades:
 * - Regenerates route and schema registries
 * - Rebuilds module client bundles for federation
 * - Regenerates database migrations
 */
export async function upgradeModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  const upgraded: string[] = []

  if (moduleName) {
    const { fullName } = normalizePackage(moduleName)

    const mod = modules[fullName]

    if (!mod) {
      logger.actionableError(
        `Module ${chalk.blue(moduleName)} is not installed`,
        'Run "bun forge modules list" to see installed modules'
      )
      process.exit(1)
    }

    const wasUpgraded = await upgradeModule(fullName, mod.version)

    if (wasUpgraded) {
      upgraded.push(fullName)
    }
  } else {
    logger.print(
      `Checking ${chalk.blue(String(Object.keys(modules).length))} modules for updates...\n`
    )

    for (const [name, { version }] of Object.entries(modules)) {
      const wasUpgraded = await upgradeModule(name, version)

      if (wasUpgraded) {
        upgraded.push(name)
      }
    }
  }

  if (upgraded.length > 0) {
    // Rebuild module client bundles for federation
    for (const mod of upgraded) {
      await buildModuleHandler(mod)
    }

    generateMigrationsHandler()

    logger.success(
      `Upgraded ${chalk.blue(String(upgraded.length))} module${upgraded.length > 1 ? 's' : ''}`
    )
  } else if (!moduleName) {
    logger.print('')
    logger.success('All modules are up to date')
  }
}
