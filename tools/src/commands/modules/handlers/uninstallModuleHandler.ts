import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import { bunInstall } from '@/utils/commands'
import Logging from '@/utils/logging'
import { findPackageName, removeDependency } from '@/utils/packageJson'

import normalizePackage from '../../../utils/normalizePackage'
import generateRouteRegistry from '../functions/registry/generateRouteRegistry'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'

export async function uninstallModuleHandler(
  moduleNames: string[]
): Promise<void> {
  const uninstalled: string[] = []

  for (const moduleName of moduleNames) {
    const { targetDir, fullName } = normalizePackage(moduleName)

    if (!findPackageName(fullName)) {
      Logging.actionableError(
        `Module ${Logging.highlight(fullName)} not found`,
        'Run "bun forge modules list" to see installed modules'
      )
      continue
    }

    Logging.info(`Uninstalling ${Logging.highlight(fullName)}...`)
    removeDependency(fullName)

    const symlinkPath = path.join(ROOT_DIR, 'node_modules', fullName)

    fs.rmSync(symlinkPath, { recursive: true, force: true })
    fs.rmSync(targetDir, { recursive: true, force: true })
    uninstalled.push(moduleName)
    Logging.success(`Uninstalled ${Logging.highlight(fullName)}`)
  }

  if (uninstalled.length === 0) {
    return
  }

  bunInstall()

  Logging.info('Regenerating registries...')
  generateRouteRegistry()
  generateSchemaRegistry()
}
