import { log } from '@clack/prompts'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  [key: string]: unknown
}

export type PackageJsonTarget = 'modules' | 'locales' | 'root'

const PACKAGE_JSON_PATHS: Record<PackageJsonTarget, string> = {
  modules: path.join(ROOT_DIR, 'modules', 'package.json'),
  locales: path.join(ROOT_DIR, 'locales', 'package.json'),
  root: path.join(ROOT_DIR, 'package.json')
}

const DEFAULT_PACKAGE_JSON: Record<
  Exclude<PackageJsonTarget, 'root'>,
  PackageJson
> = {
  modules: {
    name: '@lifeforge/modules',
    private: true,
    description: 'LifeForge modules',
    dependencies: {}
  },
  locales: {
    name: '@lifeforge/locales',
    private: true,
    description: 'LifeForge locale packages',
    dependencies: {}
  }
}

/**
 * Gets the package.json path for the specified target.
 */
export function getPackageJsonPath(target: PackageJsonTarget): string {
  return PACKAGE_JSON_PATHS[target]
}

/**
 * Ensures the package.json exists for the specified target.
 * Creates with default template if it doesn't exist (for apps and locales only).
 */
function ensurePackageJsonExists(target: PackageJsonTarget): void {
  const filePath = getPackageJsonPath(target)

  if (fs.existsSync(filePath)) {
    return
  }

  if (target === 'root') {
    log.error('Root package.json not found')
    process.exit(1)
  }

  const defaultContent = DEFAULT_PACKAGE_JSON[target]

  fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 4) + '\n')
}

/**
 * Reads a package.json file from the specified target.
 * Creates the file with a default template if it doesn't exist (for apps and locales).
 */
export function readPackageJson(target: PackageJsonTarget): PackageJson {
  ensurePackageJsonExists(target)

  const filePath = getPackageJsonPath(target)

  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

/**
 * Writes a package.json file to the specified target.
 */
export function writePackageJson(
  target: PackageJsonTarget,
  packageJson: PackageJson
): void {
  const filePath = getPackageJsonPath(target)

  fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 4) + '\n')
}

/**
 * Adds a dependency to the specified package.json.
 */
export function addDependency(
  packageName: string,
  target: PackageJsonTarget = 'modules',
  version = 'workspace:*'
): void {
  const packageJson = readPackageJson(target)

  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  packageJson.dependencies[packageName] = version

  writePackageJson(target, packageJson)
}

/**
 * Removes a dependency from the specified package.json.
 */
export function removeDependency(
  packageName: string,
  target: PackageJsonTarget = 'modules'
): void {
  const packageJson = readPackageJson(target)

  if (packageJson.dependencies?.[packageName]) {
    delete packageJson.dependencies[packageName]
    writePackageJson(target, packageJson)
  }
}

/**
 * Finds a package by name in the specified package.json dependencies.
 */
export function findPackageName(
  name: string,
  target: PackageJsonTarget = 'modules'
): string | null {
  const packageJson = readPackageJson(target)

  const dependencies = packageJson.dependencies || {}

  for (const dep of Object.keys(dependencies)) {
    if (dep === name) {
      return dep
    }
  }

  return null
}

/**
 * Checks if a dependency exists in the specified package.json.
 */
export function hasDependency(
  packageName: string,
  target: PackageJsonTarget = 'modules'
): boolean {
  const packageJson = readPackageJson(target)

  return !!packageJson.dependencies?.[packageName]
}

/**
 * Gets all dependencies from the specified package.json.
 */
export function getDependencies(
  target: PackageJsonTarget = 'modules'
): Record<string, string> {
  const packageJson = readPackageJson(target)

  return packageJson.dependencies || {}
}
