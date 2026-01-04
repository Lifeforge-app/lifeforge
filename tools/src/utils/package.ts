import fs from 'fs'
import path from 'path'

import CLILoggingService from './logging'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  [key: string]: unknown
}

export function readRootPackageJson(): PackageJson {
  const rootPackageJsonPath = path.join(process.cwd(), 'package.json')

  return JSON.parse(fs.readFileSync(rootPackageJsonPath, 'utf-8'))
}

export function writeRootPackageJson(packageJson: PackageJson): void {
  CLILoggingService.debug(`Writing root package.json`)

  const rootPackageJsonPath = path.join(process.cwd(), 'package.json')

  fs.writeFileSync(
    rootPackageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n'
  )

  CLILoggingService.debug(`Wrote root package.json`)
}

export function addWorkspaceDependency(
  packageName: string,
  version = 'workspace:*'
): void {
  CLILoggingService.debug(`Adding workspace dependency: ${packageName}`)

  const packageJson = readRootPackageJson()

  if (!packageJson.dependencies) {
    packageJson.dependencies = {}
  }

  packageJson.dependencies[packageName] = version

  writeRootPackageJson(packageJson)

  CLILoggingService.debug(`Added workspace dependency: ${packageName}`)
}

export function removeWorkspaceDependency(packageName: string): void {
  CLILoggingService.debug(`Removing workspace dependency: ${packageName}`)

  const packageJson = readRootPackageJson()

  if (packageJson.dependencies?.[packageName]) {
    delete packageJson.dependencies[packageName]
    writeRootPackageJson(packageJson)
  }

  CLILoggingService.debug(`Removed workspace dependency: ${packageName}`)
}

export function findPackageName(name: string): string | null {
  CLILoggingService.debug(`Finding package name: ${name}`)

  const packageJson = readRootPackageJson()

  const dependencies = packageJson.dependencies || {}

  for (const dep of Object.keys(dependencies)) {
    if (dep === name) {
      CLILoggingService.debug(`Found package name: ${name}`)

      return dep
    }
  }

  CLILoggingService.debug(`Package name not found: ${name}`)

  return null
}
