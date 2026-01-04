import fs from 'fs'
import path from 'path'

import executeCommand from '@/utils/commands'
import Logging, { LEVEL_ORDER } from '@/utils/logging'

/**
 * Installs a module package from the registry and copies it to the target directory.
 *
 * @param fullName The full name of the module
 * @param targetDir The target directory to copy the module to
 */
export default function installModulePackage(
  fullName: string,
  targetDir: string
) {
  Logging.debug(`Installing ${Logging.highlight(fullName)} from registry...`)

  executeCommand(`bun add ${fullName}@latest`, {
    cwd: process.cwd(),
    stdio: Logging.level > LEVEL_ORDER['info'] ? 'pipe' : 'inherit'
  })

  const installedPath = path.join(process.cwd(), 'node_modules', fullName)

  if (!fs.existsSync(installedPath)) {
    Logging.actionableError(
      `Failed to install ${Logging.highlight(fullName)}`,
      'Check if the package exists in the registry'
    )

    process.exit(1)
  }

  Logging.debug(`Copying ${Logging.highlight(fullName)} to ${targetDir}...`)
  fs.cpSync(installedPath, targetDir, { recursive: true })
}
