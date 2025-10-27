import { program } from 'commander'
import fs from 'fs'

import * as dbHandlers from '../commands/db-commands'
import { devHandler, getAvailableServices } from '../commands/dev-commands'
import * as moduleHandlers from '../commands/module-commands'
import {
  createCommandHandler,
  getAvailableCommands
} from '../commands/project-commands'
import { PROJECTS_ALLOWED } from '../constants/constants'

const VERSION_NUMBER = JSON.parse(
  fs.readFileSync('package.json', 'utf-8')
).version

/**
 * Sets up the CLI program with all commands
 */
export function setupCLI(): void {
  program
    .name('bun forge')
    .description('Build and manage the LifeForge ecosystem')
    .version(VERSION_NUMBER)

  setupProjectCommands()
  setupDevCommand()
  setupModulesCommand()
  setupDatabaseCommands()
}

/**
 * Sets up project commands (build, types, lint)
 */
function setupProjectCommands(): void {
  const availableCommands = getAvailableCommands()

  for (const commandType of availableCommands) {
    program
      .command(commandType)
      .description(`Run ${commandType} for specified projects`)
      .argument(
        '<projects...>',
        `Project names to run ${commandType} on. Use 'all' for all projects. Available: all, ${Object.keys(PROJECTS_ALLOWED).join(', ')}`
      )
      .action(createCommandHandler(commandType))
  }
}

/**
 * Sets up the dev command for starting services in development mode
 */
function setupDevCommand(): void {
  const availableServices = getAvailableServices()

  program
    .command('dev')
    .description('Start LifeForge services for development')
    .argument(
      '<service>',
      `Service to start. Use all for starting db, server, and client. Available: ${availableServices.join(', ')}`
    )
    .action(devHandler)
}

/**
 * Sets up commands for managing modules
 */
function setupModulesCommand(): void {
  const command = program
    .command('modules')
    .description('Manage LifeForge modules')

  command
    .command('list')
    .description('List all installed modules')
    .action(moduleHandlers.listModulesHandler)
  command
    .command('add')
    .description('Download and install a module')
    .argument('<module>', 'Module to add, e.g., lifeforge-app/wallet')
    .action(moduleHandlers.addModuleHandler)
  command
    .command('update')
    .description('Update an installed module')
    .argument(
      '<module>',
      'Module to update, e.g., wallet or "all" to update all modules'
    )
    .action(moduleHandlers.updateModuleHandler)
  command
    .command('remove')
    .description('Remove an installed module')
    .argument(
      '[module]',
      'Module to remove, e.g., wallet (optional, will show list if not provided)'
    )
    .action(moduleHandlers.removeModuleHandler)
  command
    .command('create')
    .description('Create a new LifeForge module scaffold')
    .argument(
      '[moduleName]',
      'Name of the module to create. Leave empty to prompt.'
    )
    .action(moduleHandlers.createModuleHandler)
  command
    .command('publish')
    .description('Publish a LifeForge module to your GitHub account')
    .argument('<module>', 'Unpublished installed module to publish')
    .action(moduleHandlers.publishModuleHandler)
}

/**
 * Sets up commands for database operations
 */
function setupDatabaseCommands(): void {
  const command = program
    .command('db')
    .description('Manage database schemas and migrations')

  command
    .command('init')
    .description('Initialize the PocketBase database')
    .argument('email', 'Admin email for PocketBase')
    .argument('password', 'Admin password for PocketBase')
    .action(dbHandlers.initializeDatabaseHandler)

  command
    .command('generate-schema')
    .description('Generate Zod schemas from PocketBase collections')
    .argument('[module]', 'Optional module name to generate schema for')
    .action(dbHandlers.generateSchemaHandler)

  command
    .command('generate-migrations')
    .description('Generate PocketBase migrations from schema files')
    .argument('[module]', 'Optional module name to generate migrations for')
    .action(dbHandlers.generateMigrationsHandler)
}

/**
 * Parses command line arguments and runs the CLI
 */
export function runCLI(): void {
  program.parse()
}
