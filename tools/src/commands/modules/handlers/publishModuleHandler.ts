import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'

import { getRegistryUrl } from '../../../utils/registry'
import validateModuleAuthor from '../functions/validateModuleAuthor'
import validateModuleStructure from '../functions/validateModuleStructure'

export async function publishModuleHandler(moduleName: string): Promise<void> {
  const modulePath = path.join(process.cwd(), 'apps', moduleName)

  if (!fs.existsSync(modulePath)) {
    Logging.actionableError(
      `Module "${moduleName}" not found in apps/`,
      'Make sure the module exists in the apps directory'
    )
    process.exit(1)
  }

  await validateModuleStructure(modulePath)
  await validateModuleAuthor(modulePath)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: modulePath,
      stdio: 'inherit'
    })
  } catch (error) {
    Logging.error(`Publish failed: ${error}`)
    process.exit(1)
  }
}
