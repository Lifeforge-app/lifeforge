import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import semver from 'semver'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import { smartReloadServer } from '@/utils/docker'
import { isDockerMode } from '@/utils/helpers'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'
import { getPackageLatestVersion } from '@/utils/registry'

import cleanModuleSource from '../functions/cleanModuleSource'
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

    // Restore gitignore to .gitignore (npm excludes .gitignore during publish)
    const gitignorePath = path.join(targetDir, 'gitignore')

    if (fs.existsSync(gitignorePath)) {
      fs.renameSync(gitignorePath, path.join(targetDir, '.gitignore'))
    }

    fs.rmSync(backupPath, { recursive: true, force: true })

    logger.print(
      `  ${chalk.green('↑')} ${chalk.blue(packageName)} ${chalk.dim(`${currentVersion} →`)} ${chalk.green(latestVersion)}`
    )

    return true
  } catch (error) {
    logger.error(`Failed to upgrade ${chalk.blue(fullName)}.`)
    logger.debug(`Error details: ${error}`)

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
 * - Builds module client bundles for federation (both dist and dist-docker)
 * - Generates database migrations if schema.ts exists
 * - Reloads the server
 */
export async function upgradeModuleHandler(moduleName?: string): Promise<void> {
  const modules = listModules()

  const upgraded: string[] = []

  if (moduleName) {
    const { fullName } = normalizePackage(moduleName)

    const mod = modules[fullName]

    if (!mod) {
      logger.error(
        `Module ${chalk.blue(moduleName)} not found in apps/package.json`
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

  if (upgraded.length === 0) {
    if (!moduleName) {
      logger.print('')
      logger.success('All modules are up to date')
    }

    return
  }

  // Build module client bundles for federation (both dist and dist-docker)
  for (const mod of upgraded) {
    logger.debug(`Building ${chalk.blue(mod)} bundles...`)

    // Build regular dist
    await buildModuleHandler(mod)

    // Build dist-docker
    await buildModuleHandler(mod, { docker: true })
  }

  // Generate migrations for upgraded modules (skip in Docker environment)
  if (!isDockerMode()) {
    for (const mod of upgraded) {
      const { targetDir } = normalizePackage(mod)

      if (fs.existsSync(path.join(targetDir, 'server', 'schema.ts'))) {
        logger.debug(`Generating database migrations for ${mod}...`)
        generateMigrationsHandler(mod)
      }
    }
  }

  // Clean source code (upgrades always run in production mode)
  logger.debug('Cleaning source code...')

  for (const mod of upgraded) {
    const { targetDir } = normalizePackage(mod)

    cleanModuleSource(targetDir)
  }

  logger.info('Source code removed. Only built bundles retained.')

  logger.success(
    `Upgraded ${chalk.blue(String(upgraded.length))} module${upgraded.length > 1 ? 's' : ''}`
  )

  smartReloadServer()
}
