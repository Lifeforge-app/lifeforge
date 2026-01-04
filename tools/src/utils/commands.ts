import { type IOType, spawnSync } from 'child_process'

import Logging, { LEVEL_ORDER } from './logging'

interface CommandExecutionOptions {
  stdio?: IOType | [IOType, IOType, IOType]
  cwd?: string
  env?: Record<string, string>
  exitOnError?: boolean
}

/**
 * Executes a shell command with proper error handling
 */
export default function executeCommand(
  command: string | (() => string),
  options: CommandExecutionOptions = {},
  _arguments: string[] = []
): string {
  let cmd: string

  try {
    cmd = typeof command === 'function' ? command() : command
  } catch (error) {
    Logging.actionableError(
      `Failed to generate command: ${error}`,
      'Check the command generation logic for errors'
    )
    process.exit(1)
  }

  try {
    Logging.debug(`Executing: ${cmd}`)

    const [toBeExecuted, ...args] = cmd.split(' ')

    const result = spawnSync(toBeExecuted, [...args, ..._arguments], {
      stdio: 'inherit',
      encoding: 'utf8',
      shell: true,
      ...options
    })

    if (result.error) {
      throw result.error
    }

    if (result.status !== 0) {
      throw result.status
    }

    if (!options.stdio || options.stdio === 'inherit') {
      Logging.debug(`Completed: ${cmd}`)
    }

    return result.stdout?.toString().trim() || ''
  } catch (error) {
    if (!options.exitOnError) {
      throw error
    }

    Logging.actionableError(
      `Command execution failed: ${cmd}`,
      'Check if the command exists and you have the necessary permissions'
    )
    Logging.debug(`Error details: ${error}`)
    process.exit(1)
  }
}

export function installDependencies() {
  executeCommand('bun install', {
    cwd: process.cwd(),
    stdio: Logging.level > LEVEL_ORDER['debug'] ? 'pipe' : 'inherit'
  })
}
