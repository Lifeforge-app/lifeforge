import fs from 'fs'
import path from 'path'

import { bunInstall } from '@/utils/commands'
import Logging from '@/utils/logging'
import { addDependency } from '@/utils/packageJson'

/**
 * Links a module to the workspace. It replace the module's version in the root package.json
 * with "workspace:*", and remove the copy of the module in node_modules, then run bun install
 * to symlink the module.
 *
 * @param fullName The full name of the module
 */
export default function linkModuleToWorkspace(fullName: string) {
  Logging.debug(`Linking ${Logging.highlight(fullName)} to workspace...`)

  addDependency(fullName)

  const nodeModulesPath = path.join(process.cwd(), 'node_modules', fullName)

  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true })
  }

  bunInstall()

  Logging.debug(`Linked ${Logging.highlight(fullName)} to workspace`)
}
