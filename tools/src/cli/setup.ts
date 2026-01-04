import { Command, program } from 'commander'
import fs from 'fs'
import path from 'path'

import { LOG_LEVELS } from '@/constants/constants'

import CLILoggingService from '../utils/logging'
import { configureHelp } from './help'

function getVersion(): string {
  try {
    const packagePath = path.resolve(__dirname, '../../package.json')

    return JSON.parse(fs.readFileSync(packagePath, 'utf-8')).version
  } catch {
    return '0.0.0'
  }
}

async function setupCommands(program: Command): Promise<void> {
  const commandsPath = path.resolve(
    import.meta.dirname.split('src')[0],
    'src/commands'
  )

  const commandIndexes = fs.globSync(`${commandsPath}/*/index.ts`)

  for (const index of commandIndexes) {
    const command = await import(index)

    command.default(program)
  }
}

/**
 * Sets up the CLI program with all commands
 */
export async function setupCLI(): Promise<void> {
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
    .hook('preAction', thisCommand => {
      const level = thisCommand.opts().logLevel as (typeof LOG_LEVELS)[number]

      if (LOG_LEVELS.includes(level)) {
        CLILoggingService.setLevel(level)
      }
    })

  await setupCommands(program)
}

/**
 * Parses command line arguments and runs the CLI
 */
export function runCLI(): void {
  program.parse()
}
