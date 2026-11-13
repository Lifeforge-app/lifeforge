import { log } from '@clack/prompts'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/utils/constants'

export interface ModuleBasicInfo {
  id: string
  name: string
  dir: string
  displayName: string
  version: string
}

const MODULES_DIR = path.join(ROOT_DIR, 'modules')

/**
 * Lists all installed modules by scanning `modules/` and reading each module's
 * package.json. The result is keyed by the module's package name and each entry
 * carries its real directory on disk.
 *
 * @param exitIfNoModule - Whether to exit the process if no modules are found
 * @returns Record of package name to module basic info
 */
export default function listModules(
  exitIfNoModule = false
): Record<string, ModuleBasicInfo> {
  const modules: Record<string, ModuleBasicInfo> = {}

  if (fs.existsSync(MODULES_DIR)) {
    for (const dirent of fs.readdirSync(MODULES_DIR, {
      withFileTypes: true
    })) {
      if (!dirent.isDirectory() || dirent.name.startsWith('.')) {
        continue
      }

      const dir = path.join(MODULES_DIR, dirent.name)

      const packageJsonPath = path.join(dir, 'package.json')

      if (!fs.existsSync(packageJsonPath)) {
        continue
      }

      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, 'utf-8')
      ) as {
        name: string
        displayName: string
        version: string
      }

      modules[packageJson.name] = {
        id: packageJson.name.replace(/^@lifeforge\//, ''),
        name: packageJson.name,
        dir,
        displayName: packageJson.displayName,
        version: packageJson.version
      }
    }
  }

  if (exitIfNoModule && Object.keys(modules).length === 0) {
    log.step('No @lifeforge/* modules found. Exiting...')
    process.exit(0)
  }

  return modules
}

/** Resolves an installed module by its package id (scope-stripped name). */
export function resolveModule(id: string): ModuleBasicInfo | undefined {
  return Object.values(listModules()).find(module => module.id === id)
}
