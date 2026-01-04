import fs from 'fs'

import { installDependencies } from '@/utils/commands'
import Logging from '@/utils/logging'
import { findPackageName, removeDependency } from '@/utils/packageJson'

import normalizePackage from '../../../utils/normalizePackage'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import generateServerRegistry from '../functions/registry/generateServerRegistry'

export async function uninstallModuleHandler(
  moduleName: string
): Promise<void> {
  const { targetDir, fullName } = normalizePackage(moduleName)

  if (!findPackageName(fullName)) {
    Logging.actionableError(
      `Module ${Logging.highlight(fullName)} not found`,
      'Run "bun forge modules list" to see installed modules'
    )

    return
  }

  Logging.info(`Uninstalling ${Logging.highlight(fullName)}...`)

  removeDependency(fullName)

  fs.rmSync(targetDir, { recursive: true, force: true })

  installDependencies()

  Logging.info('Regenerating registries...')

  generateServerRegistry()

  generateSchemaRegistry()

  Logging.success(`Uninstalled ${Logging.highlight(fullName)}`)
}
