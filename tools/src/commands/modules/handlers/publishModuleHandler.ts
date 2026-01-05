import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'
import executeCommand from '@/utils/commands'
import Logging from '@/utils/logging'

import bumpPackageVersion, {
  revertPackageVersion
} from '../../../utils/bumpPackageVersion'
import { getRegistryUrl } from '../../../utils/registry'
import validateModuleAuthor from '../functions/validateModuleAuthor'
import validateModuleStructure from '../functions/validateModuleStructure'

export async function publishModuleHandler(moduleName: string): Promise<void> {
  const modulePath = path.join(ROOT_DIR, 'apps', moduleName)

  if (!fs.existsSync(modulePath)) {
    Logging.actionableError(
      `Module "${moduleName}" not found in apps/`,
      'Make sure the module exists in the apps directory'
    )
    process.exit(1)
  }

  Logging.info(`Validating module structure...`)
  await validateModuleStructure(modulePath)

  Logging.info(`Validating module author...`)
  await validateModuleAuthor(modulePath)

  const { oldVersion, newVersion } = bumpPackageVersion(modulePath)

  Logging.info(
    `Bumped version: ${Logging.highlight(oldVersion)} → ${Logging.highlight(newVersion)}`
  )

  Logging.info(`Publishing ${Logging.highlight(moduleName)}...`)

  try {
    executeCommand(`npm publish --registry ${getRegistryUrl()}`, {
      cwd: modulePath,
      stdio: 'inherit'
    })

    Logging.success(`Published ${Logging.highlight(moduleName)} v${newVersion}`)
  } catch (error) {
    revertPackageVersion(modulePath, oldVersion)

    Logging.actionableError(
      `Publish failed for ${Logging.highlight(moduleName)}`,
      'Check npm authentication and try again'
    )
    Logging.debug(`Error: ${error}`)
    process.exit(1)
  }
}
