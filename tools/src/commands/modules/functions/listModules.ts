import fs from 'fs'
import path from 'path'

import Logging from '@/utils/logging'
import { readRootPackageJson } from '@/utils/packageJson'

import normalizePackage from '../../../utils/normalizePackage'

interface ModuleBasicInfo {
  name: string
  displayName: string
  version: string
}

/**
 * Lists all installed modules with their basic info.
 *
 * Parses the root package.json and lists all dependencies that start with `@lifeforge/` (except `@lifeforge/lang-*`),
 * then reads the package.json of each module to get the basic info.
 *
 * @param exitIfNoModule - Whether to exit the process if no modules are found
 * @returns Record of module name to module basic info
 */
export default function listModules(
  exitIfNoModule = false
): Record<string, ModuleBasicInfo> {
  const rootPackageJson = readRootPackageJson()

  const allModules = Object.keys(rootPackageJson.dependencies ?? {})
    .filter(dep => dep.startsWith('@lifeforge/'))
    .filter(dep => !dep.replace('@lifeforge/', '').startsWith('lang-'))

  const modules: Record<string, ModuleBasicInfo> = {}

  for (const module of allModules) {
    const { targetDir } = normalizePackage(module)

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(targetDir, 'package.json'), 'utf-8')
    )

    modules[module] = {
      name: packageJson.name,
      displayName: packageJson.displayName,
      version: packageJson.version
    }
  }

  if (exitIfNoModule && Object.keys(modules).length === 0) {
    Logging.info('No @lifeforge/* modules found. Exiting...')
    process.exit(0)
  }

  return modules
}
