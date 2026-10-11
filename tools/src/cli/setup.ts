import { Command, program } from 'commander'
import fs from 'fs'
import path from 'path'

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
    .name('pnpm forge')
    .description('Build and manage the LifeForge ecosystem')
    .version(getVersion())
    .enablePositionalOptions()
    .option('--host', 'Expose frontend client on the local network')
    .option(
      '--port <port>',
      'Specify the port for the client dev server (default: 5173)'
    )

  setupCommands(program)
}

/**
 * Parses command line arguments and runs the CLI
 */
export function runCLI(): void {
  program.parse()
}
