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

  command.command('list').action(moduleHandlers.listModulesHandler)
  command
    .command('add')
    .argument('<module>', 'Module to add, e.g., lifeforge-app/wallet')
    .action(moduleHandlers.addModuleHandler)
  command
    .command('remove')
    .argument(
      '[module]',
      'Module to remove, e.g., wallet (optional, will show list if not provided)'
    )
    .action(moduleHandlers.removeModuleHandler)
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
