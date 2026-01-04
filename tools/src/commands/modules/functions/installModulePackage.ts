import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import Logging from '@/utils/logging'

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
  executeCommand(`bun add ${fullName}@latest`, {
    cwd: process.cwd(),
    stdio: 'inherit'
  })

  const installedPath = path.join(process.cwd(), 'node_modules', fullName)

  if (!fs.existsSync(installedPath)) {
    Logging.error(`Failed to install ${fullName}`)

    process.exit(1)
  }

  fs.cpSync(installedPath, targetDir, { recursive: true })
}
