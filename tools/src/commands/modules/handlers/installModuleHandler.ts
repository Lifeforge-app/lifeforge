import fs from 'fs'
import path from 'path'

import { generateMigrationsHandler } from '@/commands/db/handlers/generateMigrationsHandler'
import { installPackage } from '@/utils/commands'
import Logging from '@/utils/logging'
import { checkPackageExists } from '@/utils/registry'

import normalizePackage from '../../../utils/normalizePackage'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import generateServerRegistry from '../functions/registry/generateServerRegistry'

export async function installModuleHandler(moduleName: string): Promise<void> {
  const { fullName, shortName, targetDir } = normalizePackage(moduleName)

  if (fs.existsSync(targetDir)) {
    Logging.actionableError(
      `Module already exists at apps/${shortName}`,
      `Remove it first with: bun forge modules remove ${shortName}`
    )

    return
  }

  if (!(await checkPackageExists(fullName))) {
    Logging.actionableError(
      `Module ${Logging.highlight(fullName)} does not exist`,
      `Check the module name and try again`
    )

    return
  }

  Logging.info(`Installing ${Logging.highlight(fullName)}...`)

  installPackage(fullName, targetDir)

  Logging.info('Regenerating registries...')

  generateServerRegistry()

  generateSchemaRegistry()

  if (fs.existsSync(path.join(targetDir, 'server', 'schema.ts'))) {
    Logging.info('Generating database migrations...')
    generateMigrationsHandler(moduleName)
  }

  Logging.success(`Installed ${Logging.highlight(fullName)}`)
}
