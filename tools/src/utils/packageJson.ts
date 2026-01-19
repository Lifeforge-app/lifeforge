import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

import logger from './logger'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  [key: string]: unknown
}

export type PackageJsonTarget = 'apps' | 'locales' | 'root'

const PACKAGE_JSON_PATHS: Record<PackageJsonTarget, string> = {
  apps: path.join(ROOT_DIR, 'apps', 'package.json'),
  locales: path.join(ROOT_DIR, 'locales', 'package.json'),
  root: path.join(ROOT_DIR, 'package.json')
}

const DEFAULT_PACKAGE_JSON: Record<
  Exclude<PackageJsonTarget, 'root'>,
  PackageJson
> = {
  apps: {
    name: '@lifeforge/apps',
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
    logger.actionableError(
      'Root package.json not found',
      'Ensure you are in the LifeForge project root directory'
    )
    process.exit(1)
  }

  logger.debug(`Creating ${target}/package.json with default template...`)

  const defaultContent = DEFAULT_PACKAGE_JSON[target]

  fs.writeFileSync(filePath, JSON.stringify(defaultContent, null, 4) + '\n')

  logger.debug(`Created ${target}/package.json`)
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

  logger.debug(`Writing package.json to ${target}`)

  fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 4) + '\n')

  logger.debug(`Wrote package.json to ${target}`)
}

/**
 * Adds a dependency to the specified package.json.
 */
export function addDependency(
  packageName: string,
  target: PackageJsonTarget = 'apps',
  version = 'workspace:*'
): void {
  logger.debug(`Adding dependency ${packageName} to ${target}`)

  const packageJson = readPackageJson(target)

  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  packageJson.dependencies[packageName] = version

  writePackageJson(target, packageJson)

  logger.debug(`Added dependency ${packageName} to ${target}`)
}

/**
 * Removes a dependency from the specified package.json.
 */
export function removeDependency(
  packageName: string,
  target: PackageJsonTarget = 'apps'
): void {
  logger.debug(`Removing dependency ${packageName} from ${target}`)

  const packageJson = readPackageJson(target)

  if (packageJson.dependencies?.[packageName]) {
    delete packageJson.dependencies[packageName]
    writePackageJson(target, packageJson)
  }

  logger.debug(`Removed dependency ${packageName} from ${target}`)
}

/**
 * Finds a package by name in the specified package.json dependencies.
 */
export function findPackageName(
  name: string,
  target: PackageJsonTarget = 'apps'
): string | null {
  logger.debug(`Finding package ${name} in ${target}`)

  const packageJson = readPackageJson(target)

  const dependencies = packageJson.dependencies || {}

  for (const dep of Object.keys(dependencies)) {
    if (dep === name) {
      logger.debug(`Found package ${name} in ${target}`)

      return dep
    }
  }

  logger.debug(`Package ${name} not found in ${target}`)

  return null
}

/**
 * Checks if a dependency exists in the specified package.json.
 */
export function hasDependency(
  packageName: string,
  target: PackageJsonTarget = 'apps'
): boolean {
  const packageJson = readPackageJson(target)

  return !!packageJson.dependencies?.[packageName]
}

/**
 * Gets all dependencies from the specified package.json.
 */
export function getDependencies(
  target: PackageJsonTarget = 'apps'
): Record<string, string> {
  const packageJson = readPackageJson(target)

  return packageJson.dependencies || {}
}

// Legacy exports for backward compatibility with root package.json
export function readRootPackageJson(): PackageJson {
  return readPackageJson('root')
}

export function writeRootPackageJson(packageJson: PackageJson): void {
  writePackageJson('root', packageJson)
}
