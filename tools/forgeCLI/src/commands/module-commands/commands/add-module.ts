import fs from 'fs'

import { executeCommand, validateFilePaths } from '@/utils/helpers'
import CLILoggingService from '@/utils/logging'
import { checkRunningPBInstances } from '@/utils/pocketbase'

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
  if (!fs.existsSync('.gitmodules')) {
    fs.writeFileSync('.gitmodules', '')
  }

  CLILoggingService.progress('Cloning module repository from GitHub')

  try {
    executeCommand(
      `git submodule add --force ${config.repoUrl} ${config.tempDir}/${config.moduleName}`,
      {
        exitOnError: false,
        stdio: ['ignore', 'ignore', 'ignore']
      }
    )

    CLILoggingService.success('Repository cloned successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to clone module repository',
      'Verify the repository URL is correct and accessible, or check your internet connection'
    )
    throw error
  }
}

/**
 * Validates the module structure
 */
function validateModuleStructure(config: ModuleInstallConfig): void {
  CLILoggingService.step('Validating module structure')

  const isValid = validateFilePaths(
    MODULE_STRUCTURE_REQUIREMENTS,
    `${config.tempDir}/${config.moduleName}`
  )

  if (!isValid) {
    CLILoggingService.actionableError(
      'Invalid module structure detected',
      'Ensure the module contains a "client" directory and package.json file'
    )
    throw new Error('Invalid module structure')
  }

  CLILoggingService.success('Module structure validated')
}

/**
 * Moves module from temp directory to apps directory
 */
function moveModuleToApps(config: ModuleInstallConfig): void {
  CLILoggingService.step('Installing module to workspace')

  executeCommand(
    `git mv ${config.tempDir}/${config.moduleName} ${config.moduleDir}`
  )
  CLILoggingService.success(
    `Module ${config.author}/${config.moduleName} installed successfully`
  )

  let gitmodulesContent = fs.readFileSync('.gitmodules', 'utf-8')

  const modulePath = `${config.tempDir}/${config.moduleName}`

  gitmodulesContent = gitmodulesContent.replace(
    `[submodule "${modulePath}"]`,
    `[submodule "apps/${config.moduleName}"]`
  )

  fs.writeFileSync('.gitmodules', gitmodulesContent.trim() + '\n')

  executeCommand('git add .gitmodules')
}

/**
 * Installs dependencies for the module
 */
function installDependencies(): void {
  CLILoggingService.progress('Installing dependencies')

  try {
    executeCommand('bun install --linker isolated', {
      stdio: ['ignore', 'ignore', 'ignore'],
      exitOnError: false
    })
    CLILoggingService.success('Dependencies installed successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to install dependencies',
      'Ensure Bun is installed and you have internet connectivity'
    )
    throw error
  }
}

/**
 * Generates database schema migrations
 */
function generateSchemaMigrations(moduleName: string): void {
  CLILoggingService.progress(`Generating schema migrations for ${moduleName}`)

  try {
    generateMigrationsHandler(moduleName)
    CLILoggingService.success('Schema migrations generated successfully')
  } catch {
    CLILoggingService.warn(
      'No database schema found - skipping migrations (this is normal for UI-only modules)'
    )
  }
}

/**
 * Processes server component injection for a module
 */
function processServerInjection(moduleName: string): void {
  CLILoggingService.step('Checking for server components')

  const { hasServerDir, hasServerIndex } = hasServerComponents(moduleName)

  if (!hasServerDir) {
    CLILoggingService.info(
      `No server directory found - skipping server setup (UI-only module)`
    )

    return
  }

  if (!hasServerIndex) {
    CLILoggingService.info(`No server index.ts found - skipping server setup`)

    return
  }

  CLILoggingService.progress('Setting up server components')

  try {
    injectModuleRoute(moduleName)
    CLILoggingService.success('Server routes configured')
  } catch (error) {
    CLILoggingService.warn(`Failed to inject route for ${moduleName}: ${error}`)
  }

  try {
    injectModuleSchema(moduleName)
    CLILoggingService.success('Server schema configured')
  } catch (error) {
    CLILoggingService.warn(
      `Failed to inject schema for ${moduleName}: ${error}`
    )
  }
}

function updateGitSubmodules(): void {
  CLILoggingService.progress('Updating git submodules')

  try {
    executeCommand('git submodule update --init --recursive --remote', {
      stdio: ['ignore', 'ignore', 'ignore'],
      exitOnError: false
    })
    CLILoggingService.success('Git submodules updated successfully')
  } catch (error) {
    CLILoggingService.actionableError(
      'Failed to update git submodules',
      'Check your git configuration and try again'
    )
    throw error
  }
}

/**
 * Handles adding a new module to the LifeForge system
 */
export async function addModuleHandler(repoPath: string): Promise<void> {
  checkRunningPBInstances()

  if (!validateRepositoryPath(repoPath)) {
    CLILoggingService.actionableError(
      'Invalid module repository path format',
      'Use the format <author>/<module-name>, e.g., "lifeforge-app/wallet"'
    )
    process.exit(1)
  }

  const config = createModuleConfig(repoPath)

  CLILoggingService.step(`Adding module ${repoPath} from ${config.author}`)

  cleanup(config.tempDir)
  fs.mkdirSync(config.tempDir)

  try {
    if (moduleExists(config.moduleName)) {
      CLILoggingService.actionableError(
        `Module "${config.moduleName}" already exists in workspace`,
        `Remove it first with "bun forge module remove ${config.moduleName}" if you want to re-add it`
      )
      throw new Error('Module already exists')
    }

    cloneModuleRepository(config)
    validateModuleStructure(config)
    moveModuleToApps(config)
    updateGitSubmodules()
    processServerInjection(config.moduleName)
    installDependencies()

    if (fs.existsSync(`${config.moduleDir}/server/schema.ts`)) {
      generateSchemaMigrations(config.moduleName)
    }

    CLILoggingService.success(
      `Module ${repoPath} setup completed successfully! Start the system with "bun forge dev all"`
    )
    cleanup(config.tempDir)
  } catch (error) {
    CLILoggingService.actionableError(
      'Module installation failed',
      'Check the error details above and try again'
    )
    CLILoggingService.debug(`Installation error: ${error}`)
    cleanup(config.tempDir)
    process.exit(1)
  }
}
