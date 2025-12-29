import { program } from 'commander'
import fs from 'fs'
import path from 'path'

import { createChangelogHandler } from '../commands/changelog-commands'
import * as dbHandlers from '../commands/db-commands'
import { devHandler, getAvailableServices } from '../commands/dev-commands'
import * as localeHandlers from '../commands/locale-commands'
import * as moduleHandlers from '../commands/module-commands'
import {
  createCommandHandler,
  getAvailableCommands
} from '../commands/project-commands'
import { PROJECTS_ALLOWED } from '../constants/constants'
import CLILoggingService from '../utils/logging'

function getVersion(): string {
  try {
    const packagePath = path.resolve(__dirname, '../../package.json')

    return JSON.parse(fs.readFileSync(packagePath, 'utf-8')).version
  } catch {
    return '0.0.0'
  }
}

const LOG_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const

/**
 * Sets up the CLI program with all commands
 */
export function setupCLI(): void {
  program
    .name('bun forge')
    .description('Build and manage the LifeForge ecosystem')
    .version(getVersion())
    .option(
      '-l, --log-level <level>',
      `Set log level (${LOG_LEVELS.join(', ')})`,
      'info'
    )
    .hook('preAction', thisCommand => {
      const level = thisCommand.opts().logLevel as (typeof LOG_LEVELS)[number]

      if (LOG_LEVELS.includes(level)) {
        CLILoggingService.setLevel(level)
      }
    })

  setupProjectCommands()
  setupDevCommand()
  setupModulesCommand()
  setupLocalesCommand()
  setupDatabaseCommands()
  setupChangelogCommand()
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
      '[module]',
      'Module to update, e.g., wallet (optional, will update all if not provided)'
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
    .action(dbHandlers.initializeDatabaseHandler)

  command
    .command('pull')
    .description('Pull schema from PocketBase into local schema files')
    .argument('[module]', 'Optional module name to pull schema for')
    .action(dbHandlers.generateSchemaHandler)

  command
    .command('push')
    .description('Push local schemas to PocketBase as migrations')
    .argument('[module]', 'Optional module name to push migrations for')
    .action(dbHandlers.generateMigrationsHandler)
}

/**
 * Sets up commands for managing locales
 */
function setupLocalesCommand(): void {
  const command = program
    .command('locales')
    .description('Manage LifeForge language packs')

  command
    .command('list')
    .description('List all installed language packs')
    .action(localeHandlers.listLocalesHandler)

  command
    .command('add')
    .description('Download and install a language pack')
    .argument('<lang>', 'Language code, e.g., en, ms, zh-CN, zh-TW')
    .action(localeHandlers.addLocaleHandler)

  command
    .command('remove')
    .description('Remove an installed language pack')
    .argument('<lang>', 'Language code to remove')
    .action(localeHandlers.removeLocaleHandler)
}

function setupChangelogCommand(): void {
  const command = program
    .command('changelog')
    .description('Generate changelog for LifeForge releases')

  command
    .command('create')
    .description('Create a changelog file in the docs directory')
    .argument('[year]', 'Year for the changelog, e.g., 2025')
    .argument('[week]', 'Week number for the changelog, e.g., 42')
    .action(createChangelogHandler)
}

/**
 * Parses command line arguments and runs the CLI
 */
export function runCLI(): void {
  program.parse()
}
