import chalk from 'chalk'
import { type IOType, spawnSync } from 'child_process'

import { ROOT_DIR } from '@/constants/constants'

import logger from './logger'

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
  } catch (error) {
    logger.error(`Failed to generate command.`)
    logger.debug(`Error details: ${chalk.grey(String(error))}`)
    process.exit(1)
  }

  try {
    logger.debug(
      `Executing command ${chalk.blue(cmd)} with arguments: ${chalk.blue(_arguments.length ? _arguments.join(' ') : `${chalk.red('none')}`)}`
    )

    const [toBeExecuted, ...args] = cmd.split(' ')

    if (toBeExecuted === undefined) {
      throw new Error('No command to execute')
    }

    const result = spawnSync(toBeExecuted, [...args, ..._arguments], {
      encoding: 'utf8',
      shell: true,
      ...options,
      stdio: options.stdio ?? 'pipe'
    })

    if (result.stdout) {
      logger.debug(chalk.grey(result.stdout.toString()))
    }

    if (result.stderr) {
      logger.debug(chalk.grey(result.stderr.toString()))
    }

    if (result.error) {
      throw result.error
    }

    if (result.status !== 0) {
      throw result.status
    }

    if (!options.stdio || options.stdio === 'pipe') {
      logger.debug(
        `Command Completed: ${chalk.blue(cmd)}, exit code: ${chalk.blue(String(result.status))}`
      )
    }

    return result.stdout?.toString().trim() || ''
  } catch (error) {
    if (!options.exitOnError) {
      throw error
    }

    logger.error(`Command execution failed: ${chalk.blue(cmd)}`)
    logger.debug(`Error details: ${chalk.grey(String(error))}`)
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
