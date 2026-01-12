import { LOG_LEVELS } from '@lifeforge/log'
import { Command, program } from 'commander'
import fs from 'fs'
import path from 'path'

import logger, { setLogLevel } from '@/utils/logger'

import { commands } from './commands'
import { configureHelp } from './help'

function getVersion(): string {
  try {
    const packagePath = path.resolve(__dirname, '../../package.json')

    return JSON.parse(fs.readFileSync(packagePath, 'utf-8')).version
  } catch {
    return '0.0.0'
  }
}

function setupCommands(program: Command): void {
  for (const registerCommand of commands) {
    registerCommand(program)
  }
}

/**
 * Sets up the CLI program with all commands
 */
export function setupCLI(): void {
  configureHelp(program)

  program
    .name('bun forge')
    .description('Build and manage the LifeForge ecosystem')
    .version(getVersion())
    .enablePositionalOptions()
    .option(
      '-l, --log-level <level>',
      `Set log level (${LOG_LEVELS.join(', ')})`,
      'info'
    )
    .hook('preAction', (thisCommand, actionCommand) => {
      const level = thisCommand.opts().logLevel as (typeof LOG_LEVELS)[number]

      if (LOG_LEVELS.includes(level)) {
        setLogLevel(level)
      }

      // Build full command path (e.g., "modules list")
      const commandPath: string[] = []

      let cmd: Command | null = actionCommand

      while (cmd && cmd !== program) {
        commandPath.unshift(cmd.name())
        cmd = cmd.parent
      }

      logger.debug(`Executing command "${commandPath.join(' ')}"`)
    })

  setupCommands(program)
}

/**
 * Parses command line arguments and runs the CLI
 */
export function runCLI(): void {
  program.parse()
}
