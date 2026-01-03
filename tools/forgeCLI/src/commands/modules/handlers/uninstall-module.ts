import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import { generateModuleRegistries } from '../functions/registry/generator'

interface PackageJson {
  dependencies?: Record<string, string>
  [key: string]: unknown
}

function extractModuleName(packageName: string): string {
  // @lifeforge/lifeforge--calendar -> lifeforge--calendar
  // @lifeforge/melvin--myapp -> melvin--myapp
  return packageName.replace('@lifeforge/', '')
}

function findModulePackageName(
  shortName: string,
  dependencies: Record<string, string>
): string | null {
  // Try to find the full package name from dependencies
  for (const dep of Object.keys(dependencies)) {
    if (dep.startsWith('@lifeforge/') && extractModuleName(dep) === shortName) {
      return dep
    }
  }

  return null
}

export async function uninstallModuleHandler(
  moduleName: string
): Promise<void> {
  const rootPackageJsonPath = path.join(process.cwd(), 'package.json')

  const rootPackageJson: PackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf-8')
  )

  // Determine the full package name and short name
  let fullPackageName: string
  let shortName: string

  if (moduleName.startsWith('@lifeforge/')) {
    fullPackageName = moduleName
    shortName = extractModuleName(moduleName)
  } else {
    shortName = moduleName

    const found = findModulePackageName(
      shortName,
      rootPackageJson.dependencies || {}
    )

    if (!found) {
      CLILoggingService.actionableError(
        `Module "${shortName}" is not installed`,
        'Run "bun forge modules list" to see installed modules'
      )

      return
    }

    fullPackageName = found
  }

  const appsDir = path.join(process.cwd(), 'apps')

  const targetDir = path.join(appsDir, shortName)

  CLILoggingService.info(`Uninstalling module ${fullPackageName}...`)

  // Check if module exists in apps/
  if (!fs.existsSync(targetDir)) {
    CLILoggingService.warn(`Module not found in apps/${shortName}`)
  } else {
    // Remove from apps/
    CLILoggingService.progress('Removing module files...')
    fs.rmSync(targetDir, { recursive: true, force: true })
    CLILoggingService.success(`Removed apps/${shortName}`)
  }

  // Remove from package.json
  if (rootPackageJson.dependencies?.[fullPackageName]) {
    CLILoggingService.progress('Updating package.json...')
    delete rootPackageJson.dependencies[fullPackageName]

    fs.writeFileSync(
      rootPackageJsonPath,
      JSON.stringify(rootPackageJson, null, 2) + '\n'
    )

    CLILoggingService.success('Updated root package.json')
  }

  // Remove from node_modules
  const nodeModulesPath = path.join(
    process.cwd(),
    'node_modules',
    fullPackageName
  )

  if (fs.existsSync(nodeModulesPath)) {
    fs.rmSync(nodeModulesPath, { recursive: true, force: true })
  }

  // Run bun install to clean up
  CLILoggingService.progress('Cleaning up...')

  executeCommand('bun install', {
    cwd: process.cwd(),
    stdio: 'inherit'
  })

  // Regenerate module registries
  CLILoggingService.progress('Regenerating module registries...')
  generateModuleRegistries()

  CLILoggingService.success(
    `Module ${fullPackageName} uninstalled successfully!`
  )
}
