import { type IOType, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

import logger from './logger'
import { addDependency, removeDependency } from './packageJson'
import chalk from 'chalk'

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
    logger.debug(`Executing command ${chalk.blue(cmd)} with arguments: ${chalk.blue(_arguments.length ? _arguments.join(' ') : `${chalk.red('none')}`)}`)

    const [toBeExecuted, ...args] = cmd.split(' ')

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
      logger.debug(`Command Completed: ${chalk.blue(cmd)}, exit code: ${chalk.blue(String(result.status))}`)
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
 * Runs `bun install` in the root directory to install dependencies.
 */
export function bunInstall() {
  executeCommand('bun install --ignore-scripts', {
    cwd: ROOT_DIR
  })
}

/**
 * Installs a package from the registry and copies it to the target directory.
 *
 * Downloads the package using `bun add` at root, copies from node_modules to the target
 * directory, adds it as a dependency to the appropriate package.json (apps or locales),
 * removes it from root package.json, and runs `bun install`.
 *
 * @param fullName - The full package name (e.g., `@lifeforge/lifeforge--calendar`)
 * @param targetDir - The absolute path to copy the package to
 * @param target - The package.json target to add the dependency to (defaults to 'apps')
 */
export function installPackage(
  fullName: string,
  targetDir: string,
  target: 'apps' | 'locales' = 'apps'
) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  logger.debug(`Installing ${chalk.blue(fullName)} from registry...`)

  executeCommand(`bun add ${fullName}@latest --ignore-scripts`, {
    cwd: ROOT_DIR
  })

  const installedPath = path.join(ROOT_DIR, 'node_modules', fullName)

  if (!fs.existsSync(installedPath)) {
    logger.error(`Failed to find installed package at ${chalk.blue(installedPath)}`)
    process.exit(1)
  }

  logger.debug(`Copying ${chalk.blue(fullName)} to ${chalk.blue(targetDir)}...`)
  fs.cpSync(installedPath, targetDir, { recursive: true, dereference: true })

  // Add to target package.json (apps or locales)
  addDependency(fullName, target)

  // Remove from root package.json to keep it clean
  removeDependency(fullName, 'root')

  if (fs.existsSync(installedPath)) {
    fs.rmSync(installedPath, { recursive: true, force: true })
  }

  bunInstall()
}
