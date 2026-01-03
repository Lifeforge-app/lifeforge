import fs from 'fs'
import path from 'path'

import { executeCommand } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'

import { generateModuleRegistries } from '../functions/registry/generator'

interface PackageJson {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  [key: string]: unknown
}

function extractModuleName(packageName: string): string {
  // @lifeforge/lifeforge--calendar -> lifeforge--calendar
  // @lifeforge/melvin--myapp -> melvin--myapp
  return packageName.replace('@lifeforge/', '')
}

export async function installModuleHandler(moduleName: string): Promise<void> {
  // Normalize module name
  const fullPackageName = moduleName.startsWith('@lifeforge/')
    ? moduleName
    : `@lifeforge/${moduleName}`

  const shortName = extractModuleName(fullPackageName)

  const appsDir = path.join(process.cwd(), 'apps')

  const targetDir = path.join(appsDir, shortName)

  CLILoggingService.info(`Installing module ${fullPackageName}...`)

  // Check if module already exists in apps/
  if (fs.existsSync(targetDir)) {
    CLILoggingService.actionableError(
      `Module already exists at apps/${shortName}`,
      `Remove it first with: bun forge modules remove ${shortName}`
    )

    return
  }

  // Create apps directory if it doesn't exist
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true })
  }

  CLILoggingService.progress('Fetching module from registry...')

  try {
    // Use bun to install the package to node_modules
    executeCommand(`bun add ${fullPackageName}@latest`, {
      cwd: process.cwd(),
      stdio: 'inherit'
    })

    // Find the installed package in node_modules
    const installedPath = path.join(
      process.cwd(),
      'node_modules',
      fullPackageName
    )

    if (!fs.existsSync(installedPath)) {
      throw new Error(`Failed to install ${fullPackageName}`)
    }

    CLILoggingService.progress('Moving module to apps/...')

    // Copy from node_modules to apps/
    fs.cpSync(installedPath, targetDir, { recursive: true })

    CLILoggingService.success(`Module copied to apps/${shortName}`)

    // Update root package.json to use workspace:*
    CLILoggingService.progress('Updating package.json...')

    const rootPackageJsonPath = path.join(process.cwd(), 'package.json')

    const rootPackageJson: PackageJson = JSON.parse(
      fs.readFileSync(rootPackageJsonPath, 'utf-8')
    )

    if (!rootPackageJson.dependencies) {
      rootPackageJson.dependencies = {}
    }

    // Change to workspace reference
    rootPackageJson.dependencies[fullPackageName] = 'workspace:*'

    fs.writeFileSync(
      rootPackageJsonPath,
      JSON.stringify(rootPackageJson, null, 2) + '\n'
    )

    CLILoggingService.success('Updated root package.json')

    // Run bun install to create symlinks
    CLILoggingService.progress('Linking workspace...')

    // Remove the node_modules copy so bun creates a proper symlink
    const nodeModulesPath = path.join(
      process.cwd(),
      'node_modules',
      fullPackageName
    )

    if (fs.existsSync(nodeModulesPath)) {
      fs.rmSync(nodeModulesPath, { recursive: true, force: true })
    }

    executeCommand('bun install', {
      cwd: process.cwd(),
      stdio: 'inherit'
    })

    // Generate module registries
    CLILoggingService.progress('Generating module registries...')
    generateModuleRegistries()

    // Generate database migrations if the module has a schema
    const schemaPath = path.join(targetDir, 'server', 'schema.ts')

    if (fs.existsSync(schemaPath)) {
      CLILoggingService.progress('Generating database migrations...')

      try {
        executeCommand(`bun forge db push ${shortName}`, {
          cwd: process.cwd(),
          stdio: 'inherit'
        })

        CLILoggingService.success('Database migrations generated')
      } catch {
        CLILoggingService.warn(
          'Failed to generate database migrations. You may need to run "bun forge db migrations generate" manually.'
        )
      }
    }

    CLILoggingService.success(
      `Module ${fullPackageName} installed successfully!`
    )
    CLILoggingService.info(`Location: apps/${shortName}`)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to install ${fullPackageName}`,
      'Make sure the module exists in the registry'
    )
    throw error
  }
}
