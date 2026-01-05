import fs from 'fs'
import path from 'path'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import Logging from '@/utils/logging'
import { checkPackageExists } from '@/utils/registry'

import normalizePackage from '../../../utils/normalizePackage'
import initGitRepository from '../../../utils/initGitRepository'
import generateRouteRegistry from '../functions/registry/generateRouteRegistry'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'

export async function installModuleHandler(
  moduleNames: string[]
): Promise<void> {
  const installed: string[] = []

  for (const moduleName of moduleNames) {
    const { fullName, shortName, targetDir } = normalizePackage(moduleName)

    if (fs.existsSync(targetDir)) {
      Logging.actionableError(
        `Module already exists at apps/${shortName}`,
        `Remove it first with: bun forge modules remove ${shortName}`
      )
      continue
    }

    if (!(await checkPackageExists(fullName))) {
      Logging.actionableError(
        `Module ${Logging.highlight(fullName)} does not exist`,
        `Check the module name and try again`
      )
      continue
    }

    Logging.info(`Installing ${Logging.highlight(fullName)}...`)
    installPackage(fullName, targetDir)
    initGitRepository(targetDir)
    installed.push(moduleName)
    Logging.success(`Installed ${Logging.highlight(fullName)}`)
  }

  if (installed.length === 0) {
    return
  }

  Logging.info('Regenerating registries...')
  generateRouteRegistry()
  generateSchemaRegistry()

  for (const moduleName of installed) {
    const { targetDir } = normalizePackage(moduleName)

    if (fs.existsSync(path.join(targetDir, 'server', 'schema.ts'))) {
      Logging.info(`Generating database migrations for ${moduleName}...`)
      generateMigrationsHandler(moduleName)
    }
  }
}
