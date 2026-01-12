import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import { bunInstall } from '@/utils/commands'
import { smartReloadServer } from '@/utils/docker'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'
import { findPackageName, removeDependency } from '@/utils/packageJson'

import generateRouteRegistry from '../functions/registry/generateRouteRegistry'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'

/**
 * Uninstalls one or more modules.
 *
 * For each module:
 * 1. Validates it exists in package.json
 * 2. Removes symlink from node_modules
 * 3. Removes module directory from apps/
 * 4. Removes from package.json dependencies
 *
 * After uninstallation:
 * - Runs bun install to clean up
 * - Regenerates route and schema registries
 */
export async function uninstallModuleHandler(
  moduleNames: string[]
): Promise<void> {
  const uninstalled: string[] = []

  for (const moduleName of moduleNames) {
    const { targetDir, fullName } = normalizePackage(moduleName)

    if (!findPackageName(fullName)) {
      logger.actionableError(
        `Module ${chalk.blue(fullName)} is not installed`,
        'Run "bun forge modules list" to see installed modules'
      )
      continue
    }

    logger.debug(`Uninstalling ${chalk.blue(fullName)}...`)

    removeDependency(fullName)

    const symlinkPath = path.join(ROOT_DIR, 'node_modules', fullName)

    fs.rmSync(symlinkPath, { recursive: true, force: true })
    fs.rmSync(targetDir, { recursive: true, force: true })

    uninstalled.push(moduleName)

    logger.success(`Uninstalled ${chalk.blue(fullName)}`)
  }

  if (uninstalled.length === 0) {
    return
  }

  bunInstall()

  logger.debug('Regenerating registries...')
  generateRouteRegistry()
  generateSchemaRegistry()

  smartReloadServer()
}
