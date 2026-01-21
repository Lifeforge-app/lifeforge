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

import cleanModuleSource from '../functions/cleanModuleSource'
import { buildModuleHandler } from './buildModuleHandler'

interface InstallOptions {
  dev?: boolean
}

/**
 * Installs one or more modules from the registry.
 *
 * For each module:
 * 1. Validates it doesn't already exist locally
 * 2. Checks it exists in the registry
 * 3. Downloads and extracts to apps/
 * 4. Initializes git repository (if --dev)
 * 5. Builds both dist and dist-docker bundles
 * 6. Removes source code (unless --dev is passed)
 *
 * After installation:
 * - Builds module client bundles for federation (both modes)
 * - Generates database migrations if schema.ts exists
 */
export async function installModuleHandler(
  moduleNames: string[],
  options?: InstallOptions
): Promise<void> {
  const isDevMode = options?.dev ?? false

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

    installPackage(fullName, targetDir, 'apps')

    // Restore gitignore to .gitignore (npm excludes .gitignore during publish)
    const gitignorePath = path.join(targetDir, 'gitignore')

    if (fs.existsSync(gitignorePath)) {
      fs.renameSync(gitignorePath, path.join(targetDir, '.gitignore'))
    }

    if (isDevMode) {
      initGitRepository(targetDir)
    }

    installed.push(moduleName)

    logger.success(`Installed ${chalk.blue(fullName)}`)
  }

  if (installed.length === 0) {
    return
  }

  // Build module client bundles for federation (both dist and dist-docker)
  for (const moduleName of installed) {
    logger.debug(`Building ${chalk.blue(moduleName)} bundles...`)

    // Build regular dist
    await buildModuleHandler(moduleName)

    // Build dist-docker
    await buildModuleHandler(moduleName, { docker: true })
  }

  // Generate migrations for new modules (skip in Docker environment)
  if (!isDockerMode()) {
    for (const moduleName of installed) {
      const { targetDir } = normalizePackage(moduleName)

      if (fs.existsSync(path.join(targetDir, 'server', 'schema.ts'))) {
        logger.debug(`Generating database migrations for ${moduleName}...`)
        await generateMigrationsHandler(moduleName)
      }
    }
  }

  // Clean source code if not in dev mode
  if (!isDevMode) {
    logger.debug('Cleaning source code (production mode)...')

    for (const moduleName of installed) {
      const { targetDir } = normalizePackage(moduleName)

      cleanModuleSource(targetDir)
    }

    logger.info('Source code removed. Only built bundles retained.')
  }

  smartReloadServer()
}
