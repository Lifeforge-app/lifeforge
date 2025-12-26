import chalk from 'chalk'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'

import { CLILoggingService } from '../../../utils/logging'
import { generateSchemaHandler } from '../../db-commands'
import { cleanupOldMigrations } from '../../db-commands/utils/pocketbase-utils'
import {
  getInstalledModules,
  hasServerComponents,
  moduleExists
} from '../utils/file-system'
import {
  removeModuleRoute,
  removeModuleSchema
} from '../utils/server-injection'

/**
 * Removes server component references for a module
 */
function removeServerReferences(moduleName: string): void {
  CLILoggingService.progress('Removing server references')

  try {
    removeModuleRoute(moduleName)
    CLILoggingService.success('Server routes removed')
  } catch (error) {
    CLILoggingService.warn(`Failed to remove route for ${moduleName}: ${error}`)
  }

  try {
    removeModuleSchema(moduleName)
    CLILoggingService.success('Server schema references removed')
  } catch (error) {
    CLILoggingService.warn(
      `Failed to remove schema for ${moduleName}: ${error}`
    )
  }
}

/**
 * Removes module migration files and syncs history
 */
async function removeModuleMigrations(moduleName: string): Promise<void> {
  CLILoggingService.progress(`Removing migrations for module: ${moduleName}`)

  try {
    await cleanupOldMigrations(moduleName)
    CLILoggingService.success(`Migrations for module "${moduleName}" removed`)
  } catch (error) {
    CLILoggingService.warn(
      `Failed to remove migrations for ${moduleName}: ${error}`
    )
  }
}

/**
 * Removes the module directory (handles both regular directories and git submodules)
 */
function removeModuleDirectory(moduleName: string): void {
  const modulePath = `apps/${moduleName}`

  const moduleDir = path.join(process.cwd(), modulePath)

  if (!fs.existsSync(moduleDir)) {
    CLILoggingService.warn(`Module directory ${modulePath} does not exist`)

    return
  }

  CLILoggingService.progress(`Removing module directory: ${modulePath}`)

  // Check if it's a git submodule
  const gitModulesPath = path.join(process.cwd(), '.gitmodules')

  const isSubmodule =
    fs.existsSync(gitModulesPath) &&
    fs
      .readFileSync(gitModulesPath, 'utf8')
      .includes(`[submodule "${modulePath}"]`)

  if (isSubmodule) {
    removeGitSubmodule(modulePath)
  } else {
    removeRegularDirectory(moduleDir, modulePath)
  }
}

/**
 * Removes a git submodule using proper git commands
 */
function removeGitSubmodule(modulePath: string): void {
  CLILoggingService.progress(`Removing git submodule: ${modulePath}`)

  try {
    // Deinitialize the submodule
    execSync(`git submodule deinit -f ${modulePath}`, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.debug('Submodule deinitialized')

    // Remove from git index and working tree
    execSync(`git rm -f ${modulePath}`, {
      cwd: process.cwd(),
      stdio: ['pipe', 'pipe', 'pipe']
    })
    CLILoggingService.debug('Submodule removed from git')

    // Remove the .git/modules entry
    const gitModulesDir = path.join(
      process.cwd(),
      '.git',
      'modules',
      modulePath
    )

    if (fs.existsSync(gitModulesDir)) {
      fs.rmSync(gitModulesDir, { recursive: true, force: true })
      CLILoggingService.debug('Submodule git directory removed')
    }

    CLILoggingService.success(`Git submodule removed: ${modulePath}`)
  } catch (error) {
    CLILoggingService.warn(
      `Git submodule removal failed, falling back to manual removal: ${error}`
    )

    // Fallback to manual removal
    const moduleDir = path.join(process.cwd(), modulePath)

    removeRegularDirectory(moduleDir, modulePath)
    removeGitModulesEntry(modulePath)
  }
}

/**
 * Removes a regular directory (non-submodule)
 */
function removeRegularDirectory(moduleDir: string, modulePath: string): void {
  try {
    fs.rmSync(moduleDir, { recursive: true, force: true })
    CLILoggingService.success(`Module directory removed: ${modulePath}`)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to remove module directory: ${modulePath}`,
      'Check file permissions and ensure no processes are using the module files'
    )
    throw error
  }
}

/**
 * Manually removes module entry from .gitmodules file (fallback)
 */
function removeGitModulesEntry(modulePath: string): void {
  const gitModulesPath = path.join(process.cwd(), '.gitmodules')

  if (!fs.existsSync(gitModulesPath)) {
    return
  }

  CLILoggingService.progress('Updating .gitmodules file')

  try {
    let gitModulesContent = fs.readFileSync(gitModulesPath, 'utf8')

    // Remove the module entry from .gitmodules
    const moduleEntryRegex = new RegExp(
      `\\[submodule "${modulePath.replace(
        /[-/\\^$*+?.()|[\]{}]/g,
        '\\$&'
      )}"\\][^\\[]*`,
      'g'
    )

    gitModulesContent = gitModulesContent.replace(moduleEntryRegex, '')

    // Clean up empty lines
    gitModulesContent = gitModulesContent.replace(/\n{3,}/g, '\n\n').trim()

    if (gitModulesContent) {
      fs.writeFileSync(gitModulesPath, gitModulesContent + '\n', 'utf8')
    } else {
      fs.unlinkSync(gitModulesPath)
    }

    CLILoggingService.success('.gitmodules file updated')
  } catch (error) {
    CLILoggingService.warn(`Failed to update .gitmodules file: ${error}`)
  }
}

/**
 * Regenerates database schemas after module removal
 */
async function regenerateSchemas(): Promise<void> {
  CLILoggingService.progress('Regenerating database schemas')

  try {
    await generateSchemaHandler()
    CLILoggingService.success('Database schemas regenerated')
  } catch (error) {
    CLILoggingService.warn(`Failed to regenerate schemas: ${error}`)
  }
}

/**
 * Prompts user to select a module to remove
 */
async function selectModuleToRemove(): Promise<string> {
  const installedModules = getInstalledModules()

  if (installedModules.length === 0) {
    CLILoggingService.info('No modules found to remove')
    process.exit(0)
  }

  // Create choices with detailed information
  const choices = installedModules.map(module => {
    const modulePath = `apps/${module}`

    const packageJsonPath = path.join(modulePath, 'package.json')

    let description = 'No description'

    // Try to get additional info from package.json
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

        description = packageData.description || 'No description'
      } catch {
        // If we can't read package.json, use defaults
      }
    }

    // Check if module has server components
    const { hasServerDir, hasServerIndex } = hasServerComponents(module)

    const serverStatus =
      hasServerDir && hasServerIndex
        ? chalk.green('[Server]')
        : chalk.blue('[Client only]')

    return {
      title: `${chalk.cyan.bold(module)} - ${chalk.gray(description)} ${serverStatus}`,
      value: module
    }
  })

  // Add cancel option
  choices.push({
    title: chalk.red('Cancel (do not remove any module)'),
    value: '__cancel__'
  })

  const response = await prompts({
    type: 'autocomplete',
    name: 'selectedModule',
    message: 'Which module would you like to remove?',
    choices,
    initial: 0,
    suggest: (input: string, choices: { value?: string; title?: string }[]) => {
      return Promise.resolve(
        choices.filter(
          choice =>
            choice.value?.toLowerCase().includes(input.toLowerCase()) ||
            choice.title?.toLowerCase().includes(input.toLowerCase())
        )
      )
    }
  })

  if (!response.selectedModule || response.selectedModule === '__cancel__') {
    CLILoggingService.info('Module removal cancelled')
    process.exit(0)
  }

  // Confirm the deletion
  const confirmResponse = await prompts({
    type: 'confirm',
    name: 'confirmRemoval',
    message: `Are you sure you want to PERMANENTLY REMOVE the "${response.selectedModule}" module?\n   This action cannot be undone and will delete all module files and migrations.`,
    initial: false
  })

  if (!confirmResponse.confirmRemoval) {
    CLILoggingService.info('Module removal cancelled')
    process.exit(0)
  }

  return response.selectedModule
}

/**
 * Handles removing a module from the LifeForge system
 */
export async function removeModuleHandler(moduleName?: string): Promise<void> {
  CLILoggingService.step('Starting module removal process')

  // If no module name provided, show interactive selection
  if (!moduleName) {
    moduleName = await selectModuleToRemove()
  }

  // Validate module exists
  if (!moduleExists(moduleName)) {
    CLILoggingService.actionableError(
      `Module "${moduleName}" does not exist in workspace`,
      'Use "bun forge module list" to see available modules'
    )
    process.exit(1)
  }

  CLILoggingService.step(`Removing module: ${moduleName}`)

  try {
    // Remove server references first
    removeServerReferences(moduleName)

    // Remove module migrations
    await removeModuleMigrations(moduleName)

    // Remove the module directory
    removeModuleDirectory(moduleName)

    // Regenerate schemas
    await regenerateSchemas()

    CLILoggingService.success(`Module "${moduleName}" removed successfully`)
    CLILoggingService.info(
      'Restart the system with "bun forge dev all" to see the changes'
    )
  } catch (error) {
    CLILoggingService.actionableError(
      'Module removal failed',
      'Check the error details above and ensure you have proper file permissions'
    )
    CLILoggingService.debug(`Removal error: ${error}`)
    process.exit(1)
  }
}
