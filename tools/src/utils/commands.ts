import { log } from '@clack/prompts'
import chalk from 'chalk'
import { type IOType, spawnSync } from 'child_process'

import { ROOT_DIR } from '@/utils/constants'

interface CommandExecutionOptions {
  stdio?: IOType | [IOType, IOType, IOType]
  cwd?: string
  env?: Record<string, string>
  exitOnError?: boolean
}

/**
 * Executes a shell command synchronously with proper error handling.
 *
 * @param command - The command to execute, either as a string or a function that returns a string
 * @param options - Execution options including stdio, cwd, env, and exitOnError
 * @param _arguments - Additional arguments to append to the command
 * @returns The trimmed stdout output from the command
 * @throws Re-throws errors if `exitOnError` is false, otherwise exits the process
 */
export default function executeCommand(
  command: string | (() => string),
  options: CommandExecutionOptions = {},
  _arguments: string[] = []
): string {
  let cmd: string

  try {
    cmd = typeof command === 'function' ? command() : command
  } catch {
    log.error(`Failed to generate command.`)
    process.exit(1)
  }

  try {
    // `shell: true` concatenates arguments anyway, and passing an args array
    // alongside it is deprecated (Node DEP0190). Build the full command string.
    const fullCommand =
      _arguments.length > 0 ? `${cmd} ${_arguments.join(' ')}` : cmd

    const result = spawnSync(fullCommand, {
      encoding: 'utf8',
      shell: true,
      ...options,
      stdio: options.stdio ?? 'pipe'
    })

    if (result.error) {
      throw result.error
    }

    if (result.status !== 0) {
      const output = [result.stderr, result.stdout]
        .map(stream => stream?.toString().trim())
        .filter(Boolean)
        .join('\n')

      throw new Error(
        output
          ? `Command failed with exit code ${result.status}: ${cmd}\n${output}`
          : `Command failed with exit code ${result.status}: ${cmd}`
      )
    }

    return result.stdout?.toString().trim() || ''
  } catch (error) {
    if (!options.exitOnError) {
      throw error
    }

    log.error(`Command execution failed: ${chalk.blue(cmd)}`)
    process.exit(1)
  }
}

/**
 * Runs `pnpm install` in the root directory to install dependencies.
 */
export function installDeps() {
  executeCommand('pnpm install --ignore-scripts', {
    cwd: ROOT_DIR
  })
}
