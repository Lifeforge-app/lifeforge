import fs from 'fs'

import {
  checkRunningPBInstances,
  executeCommand,
  validateFilePaths
} from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
import { generateMigrationsHandler } from '../../db-commands'
import {
  MODULE_STRUCTURE_REQUIREMENTS,
  type ModuleInstallConfig
} from '../utils/constants'
import { cleanup } from '../utils/file-system'
import { hasServerComponents, moduleExists } from '../utils/file-system'
import {
  injectModuleRoute,
  injectModuleSchema
} from '../utils/server-injection'
import { createModuleConfig, validateRepositoryPath } from '../utils/validation'

/**
 * Clones module repository from GitHub
 */
function cloneModuleRepository(config: ModuleInstallConfig): void {
  try {
    executeCommand(
      `git clone ${config.repoUrl} ${config.tempDir}/${config.moduleName}`,
      {
        exitOnError: false,
        stdio: ['ignore', 'ignore', 'ignore']
      }
    )
  } catch (error) {
    CLILoggingService.error(
      `Failed to clone module repository. Please check if the repository exists and is public.`
    )
    throw error
  }
}

/**
 * Validates the module structure
 */
function validateModuleStructure(config: ModuleInstallConfig): void {
  const isValid = validateFilePaths(
    MODULE_STRUCTURE_REQUIREMENTS,
    `${config.tempDir}/${config.moduleName}`
  )

  if (!isValid) {
    CLILoggingService.error(
      'Invalid module structure. The module must contain "client" directory and package.json file.'
    )
    throw new Error('Invalid module structure')
  }

  CLILoggingService.info(`Module structure validated.`)
}

/**
 * Moves module from temp directory to apps directory
 */
function moveModuleToApps(config: ModuleInstallConfig): void {
  executeCommand(
    `mv ${config.tempDir}/${config.moduleName} ${config.moduleDir}`
  )
  CLILoggingService.info(
    `Module ${config.author}/${config.moduleName} added successfully.`
  )
}

/**
 * Installs dependencies for the module
 */
function installDependencies(): void {
  CLILoggingService.info(`Installing dependencies...`)

  try {
    executeCommand('bun install', {
      stdio: ['ignore', 'ignore', 'ignore'],
      exitOnError: false
    })
    CLILoggingService.info(`Dependencies installed successfully.`)
  } catch (error) {
    CLILoggingService.error(`Failed to install dependencies`)
    throw error
  }
}

/**
 * Generates database schema migrations
 */
function generateSchemaMigrations(moduleName: string): void {
  CLILoggingService.info(`Generating schema migrations for ${moduleName}...`)

  try {
    generateMigrationsHandler(moduleName)
    CLILoggingService.info(`Schema migrations generated successfully.`)
  } catch {
    CLILoggingService.warn(
      `Failed to generate schema migrations. This is normal if the module doesn't have database schemas.`
    )
  }
}

/**
 * Processes server component injection for a module
 */
function processServerInjection(moduleName: string): void {
  CLILoggingService.info(`Checking for server components...`)

  const { hasServerDir, hasServerIndex } = hasServerComponents(moduleName)

  if (!hasServerDir) {
    CLILoggingService.info(
      `No server directory found for module "${moduleName}", skipping server injection`
    )

    return
  }

  if (!hasServerIndex) {
    CLILoggingService.info(
      `No server index.ts found for module "${moduleName}", skipping server injection`
    )

    return
  }

  CLILoggingService.info(`Injecting server imports...`)

  try {
    injectModuleRoute(moduleName)
  } catch (error) {
    CLILoggingService.warn(`Failed to inject route for ${moduleName}: ${error}`)
  }

  try {
    injectModuleSchema(moduleName)
  } catch (error) {
    CLILoggingService.warn(
      `Failed to inject schema for ${moduleName}: ${error}`
    )
  }
}

/**
 * Handles adding a new module to the Lifeforge system
 */
export function addModuleHandler(repoPath: string): void {
  checkRunningPBInstances()

  if (!validateRepositoryPath(repoPath)) {
    CLILoggingService.error(
      'Invalid module name. Use the format <author>/<module-name>, e.g., lifeforge-app/wallet'
    )
    process.exit(1)
  }

  const config = createModuleConfig(repoPath)

  CLILoggingService.info(`Adding module ${repoPath} from ${config.author}`)

  cleanup(config.tempDir)
  fs.mkdirSync(config.tempDir)

  try {
    if (moduleExists(config.moduleName)) {
      CLILoggingService.error(
        `A module with the name "${config.moduleName}" already exists in apps/. Please remove it first if you want to re-add.`
      )
      throw new Error('Module already exists')
    }

    cloneModuleRepository(config)
    validateModuleStructure(config)
    moveModuleToApps(config)
    processServerInjection(config.moduleName)
    installDependencies()

    if (fs.existsSync(`${config.moduleDir}/server/schema.ts`)) {
      generateSchemaMigrations(config.moduleName)
    }

    CLILoggingService.info(
      `Module ${repoPath} setup completed. You may now start the system by using "bun forge dev all"`
    )
    cleanup(config.tempDir)
  } catch (error) {
    CLILoggingService.error(`Module installation failed: ${error}`)
    cleanup(config.tempDir)
    process.exit(1)
  }
}
