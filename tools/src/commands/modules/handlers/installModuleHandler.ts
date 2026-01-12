import chalk from 'chalk'
import fs from 'fs'
import path from 'path'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import { smartReloadServer } from '@/utils/docker'
import { isDockerMode } from '@/utils/helpers'
import initGitRepository from '@/utils/initGitRepository'
import logger from '@/utils/logger'
import normalizePackage from '@/utils/normalizePackage'
import { checkPackageExists } from '@/utils/registry'

import generateRouteRegistry from '../functions/registry/generateRouteRegistry'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import { buildModuleHandler } from './buildModuleHandler'

/**
 * Installs one or more modules from the registry.
 *
 * For each module:
 * 1. Validates it doesn't already exist locally
 * 2. Checks it exists in the registry
 * 3. Downloads and extracts to apps/
 * 4. Initializes git repository
 *
 * After installation:
 * - Regenerates route and schema registries
 * - Builds module client bundles for federation
 * - Generates database migrations if schema.ts exists
 */
export async function installModuleHandler(
  moduleNames: string[]
): Promise<void> {
  const installed: string[] = []

  for (const moduleName of moduleNames) {
    const { fullName, shortName, targetDir } = normalizePackage(moduleName)

    if (!/^@lifeforge\/[a-z0-9-_]+--[a-z0-9-_]+$/i.test(fullName)) {
      logger.actionableError(
        `Invalid module name: ${chalk.blue(moduleName)}`,
        'Module names can only contain letters, numbers, hyphens, and underscores.'
      )
      continue
    }

    if (fs.existsSync(targetDir)) {
      logger.actionableError(
        `Module already exists at apps/${shortName}`,
        `Remove it first with: bun forge modules uninstall ${shortName}`
      )
      continue
    }

    if (!(await checkPackageExists(fullName))) {
      logger.actionableError(
        `Module ${chalk.blue(fullName)} does not exist in registry`,
        'Check the module name and try again'
      )
      continue
    }

    logger.debug(`Installing ${chalk.blue(fullName)}...`)

    installPackage(fullName, targetDir)
    initGitRepository(targetDir)

    installed.push(moduleName)

    logger.success(`Installed ${chalk.blue(fullName)}`)
  }

  if (installed.length === 0) {
    return
  }

  logger.debug('Regenerating registries...')
  generateRouteRegistry()
  generateSchemaRegistry()

  // Build module client bundles for federation
  for (const moduleName of installed) {
    await buildModuleHandler(moduleName)
  }

  // Generate migrations for new modules (only in non-Docker mode)
  if (!isDockerMode()) {
    for (const moduleName of installed) {
      const { targetDir } = normalizePackage(moduleName)

      if (fs.existsSync(path.join(targetDir, 'server', 'schema.ts'))) {
        logger.debug(`Generating database migrations for ${moduleName}...`)
        generateMigrationsHandler(moduleName)
      }
    }
  }

  smartReloadServer()
}
