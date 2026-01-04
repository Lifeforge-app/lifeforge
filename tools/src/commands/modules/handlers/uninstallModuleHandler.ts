import fs from 'fs'

import { executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'
import { findPackageName, removeDependency } from '@/utils/packageJson'

import getFsMetadata from '../functions/getFsMetadata'
import generateSchemaRegistry from '../functions/registry/generateSchemaRegistry'
import generateServerRegistry from '../functions/registry/generateServerRegistry'

export async function uninstallModuleHandler(
  moduleName: string
): Promise<void> {
  const { targetDir, fullName } = getFsMetadata(moduleName)

  if (!findPackageName(fullName)) {
    Logging.error(`Module ${fullName} not found`)

    return
  }

  removeDependency(fullName)

  fs.rmSync(targetDir, { recursive: true, force: true })

  executeCommand('bun install', {
    cwd: process.cwd(),
    stdio: 'inherit'
  })

  generateServerRegistry()

  generateSchemaRegistry()
}
