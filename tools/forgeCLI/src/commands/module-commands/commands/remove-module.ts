import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'

import { executeCommand } from '../../../utils/helpers'
import { CLILoggingService } from '../../../utils/logging'
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
 * Removes the module directory
 */
function removeModuleDirectory(moduleName: string): void {
  const moduleDir = `apps/${moduleName}`

  if (!fs.existsSync(moduleDir)) {
    CLILoggingService.warn(`Module directory ${moduleDir} does not exist`)

    return
  }

  CLILoggingService.progress(`Removing module directory: ${moduleDir}`)

  try {
    executeCommand(`rm -rf ${moduleDir}`)
    CLILoggingService.success(`Module directory removed: ${moduleDir}`)
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to remove module directory: ${moduleDir}`,
      'Check file permissions and ensure no processes are using the module files'
    )
    throw error
  }

  const gitModulesPath = path.join('.gitmodules')

  if (fs.existsSync(gitModulesPath)) {
    CLILoggingService.progress('Updating .gitmodules file')

    try {
      let gitModulesContent = fs.readFileSync(gitModulesPath, 'utf8')

      const modulePath = `apps/${moduleName}`

      // Remove the module entry from .gitmodules
      const moduleEntryRegex = new RegExp(
        `\\[submodule "${modulePath.replace(
          /[-\/\\^$*+?.()|[\]{}]/g,
          '\\$&'
        )}"\\][^\\[]*`,
        'g'
      )
      gitModulesContent = gitModulesContent.replace(moduleEntryRegex, '')

      fs.writeFileSync(gitModulesPath, gitModulesContent, 'utf8')

      CLILoggingService.success('.gitmodules file updated')
    } catch (error) {
      CLILoggingService.warn(`Failed to update .gitmodules file: ${error}`)
    }
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

    const moduleName = chalk.cyan.bold(module)

    const moduleDescription = chalk.gray(description)

    return {
      title: `${moduleName} - ${moduleDescription} ${serverStatus}`,
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
    suggest: (input: string, choices: any[]) => {
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
    message: `Are you sure you want to PERMANENTLY REMOVE the "${response.selectedModule}" module?\n   This action cannot be undone and will delete all module files.`,
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

    // Remove the module directory
    removeModuleDirectory(moduleName)

    CLILoggingService.success(`Module "${moduleName}" removed successfully`)
    CLILoggingService.info(
      'Restart the system with "bun forge dev all" to see the changes'
    )
    CLILoggingService.warn(
      'Database migrations are not rolled back to prevent data loss. Remove database schemas manually if needed.'
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
