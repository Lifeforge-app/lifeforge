import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

import Logging from './logging'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  [key: string]: unknown
}

const ROOT_PACKAGE_JSON_DIR = path.join(ROOT_DIR, 'package.json')

/**
 * Reads the root package.json file and returns it as a JSON object.
 *
 * @returns The root package.json file as a JSON object.
 */
export function readRootPackageJson(): PackageJson {
  return JSON.parse(fs.readFileSync(ROOT_PACKAGE_JSON_DIR, 'utf-8'))
}

/**
 * Writes the root package.json file with the given JSON object.
 *
 * @param packageJson The JSON object to write to the root package.json file.
 */
export function writeRootPackageJson(packageJson: PackageJson): void {
  Logging.debug(`Writing root package.json`)

  fs.writeFileSync(
    ROOT_PACKAGE_JSON_DIR,
    JSON.stringify(packageJson, null, 2) + '\n'
  )

  Logging.debug(`Wrote root package.json`)
}

/**
 * Adds a dependency to the root package.json file.
 *
 * @param packageName The name of the package to add as a dependency.
 * @param version The version of the package to add as a dependency. Defaults to 'workspace:*'.
 */
export function addDependency(
  packageName: string,
  version = 'workspace:*'
): void {
  Logging.debug(`Adding workspace dependency: ${packageName}`)

  const packageJson = readRootPackageJson()

  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  packageJson.dependencies[packageName] = version

  writeRootPackageJson(packageJson)

  Logging.debug(`Added workspace dependency: ${packageName}`)
}

/**
 * Removes a dependency from the root package.json file.
 *
 * @param packageName The name of the package to remove as a dependency.
 */
export function removeDependency(packageName: string): void {
  Logging.debug(`Removing workspace dependency: ${packageName}`)

  const packageJson = readRootPackageJson()

  if (packageJson.dependencies?.[packageName]) {
    delete packageJson.dependencies[packageName]
    writeRootPackageJson(packageJson)
  }

  Logging.debug(`Removed workspace dependency: ${packageName}`)
}

export function findPackageName(name: string): string | null {
  Logging.debug(`Finding package name: ${name}`)

  const packageJson = readRootPackageJson()

  const dependencies = packageJson.dependencies || {}

  for (const dep of Object.keys(dependencies)) {
    if (dep === name) {
      Logging.debug(`Found package name: ${name}`)

      return dep
    }
  }

  Logging.debug(`Package name not found: ${name}`)

  return null
}
