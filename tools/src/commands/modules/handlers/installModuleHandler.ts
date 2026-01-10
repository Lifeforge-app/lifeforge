import fs from 'fs'
import path from 'path'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { reloadHandler } from '@/commands/docker/handlers/reloadHandler'
import { installPackage } from '@/utils/commands'
import { isDockerMode } from '@/utils/helpers'
import initGitRepository from '@/utils/initGitRepository'
import Logging from '@/utils/logging'
import normalizePackage from '@/utils/normalizePackage'
import { checkPackageExists } from '@/utils/registry'

import generateRouteRegistry from '../functions/registry/generateRouteRegistry'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import { buildModuleHandler } from './buildModuleHandler'

interface InstallOptions {
  reload?: boolean
}

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
 * - Optionally triggers Docker reload (--reload flag)
 */
export async function installModuleHandler(
  moduleNames: string[],
  options: InstallOptions
): Promise<void> {
  const installed: string[] = []

  for (const moduleName of moduleNames) {
    const { fullName, shortName, targetDir } = normalizePackage(moduleName)

    if (!/^@lifeforge\/[a-z0-9-_]+--[a-z0-9-_]+$/i.test(fullName)) {
      Logging.actionableError(
        `Invalid module name: ${Logging.highlight(moduleName)}`,
        'Module names can only contain letters, numbers, hyphens, and underscores.'
      )
      continue
    }

    if (fs.existsSync(targetDir)) {
      Logging.actionableError(
        `Module already exists at apps/${shortName}`,
        `Remove it first with: bun forge modules uninstall ${shortName}`
      )
      continue
    }

    if (!(await checkPackageExists(fullName))) {
      Logging.actionableError(
        `Module ${Logging.highlight(fullName)} does not exist in registry`,
        'Check the module name and try again'
      )
      continue
    }

    Logging.debug(`Installing ${Logging.highlight(fullName)}...`)

    installPackage(fullName, targetDir)
    initGitRepository(targetDir)

    installed.push(moduleName)

    Logging.success(`Installed ${Logging.highlight(fullName)}`)
  }

  if (installed.length === 0) {
    return
  }

  Logging.debug('Regenerating registries...')
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
        Logging.debug(`Generating database migrations for ${moduleName}...`)
        generateMigrationsHandler(moduleName)
      }
    }
  }

  // Trigger Docker reload if requested
  if (options.reload) {
    Logging.info('Triggering Docker reload...')
    await reloadHandler({})
  }
}
