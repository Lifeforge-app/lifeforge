import { program } from 'commander'

import { devHandler, getAvailableServices } from '../commands/dev-commands'
import {
  createCommandHandler,
  getAvailableCommands
} from '../commands/project-commands'
import { PROJECTS_ALLOWED } from '../constants/constants'

/**
 * Sets up the CLI program with all commands
 */
export function setupCLI(): void {
  program
    .name('Lifeforge Forge')
    .description('Build and manage Lifeforge projects')
    .version('25w41')

  setupProjectCommands()
  setupDevCommand()
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
 * Sets up the dev command
 */
function setupDevCommand(): void {
  const availableServices = getAvailableServices()

  program
    .command('dev')
    .description('Start Lifeforge services for development')
    .argument(
      '<service>',
      `Service to start. Use all for starting db, server, and client. Available: ${availableServices.join(', ')}`
    )
    .action(devHandler)
}

/**
 * Parses command line arguments and runs the CLI
 */
export function runCLI(): void {
  program.parse()
}
