import { LOG_LEVELS, type LogLevel } from '@lifeforge/log'
import { type IOType, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

import logger from './logger'
import { addDependency, removeDependency } from './packageJson'

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
    logger.actionableError(
      `Failed to generate command: ${error}`,
      'Check the command generation logic for errors'
    )
    process.exit(1)
  }

  try {
    logger.debug(`Executing: ${cmd}`)

    const [toBeExecuted, ...args] = cmd.split(' ')

    const result = spawnSync(toBeExecuted, [...args, ..._arguments], {
      encoding: 'utf8',
      shell: true,
      ...options,
      stdio: options.stdio ?? 'pipe'
    })

    if (logger.level === 'debug') {
      if (result.stdout) {
        process.stdout.write(result.stdout.toString())
      }

      if (result.stderr) {
        process.stderr.write(result.stderr.toString())
      }
    }

    if (result.error) {
      throw result.error
    }

    if (result.status !== 0) {
      throw result.status
    }

    if (!options.stdio || options.stdio === 'pipe') {
      logger.debug(`Completed: ${cmd}`)
    }

    return result.stdout?.toString().trim() || ''
  } catch (error) {
    if (!options.exitOnError) {
      throw error
    }

    logger.actionableError(
      `Command execution failed: ${cmd}`,
      'Check if the command exists and you have the necessary permissions'
    )
    logger.debug(`Error details: ${error}`)
    process.exit(1)
  }
}

/**
 * Runs `bun install` in the root directory to install dependencies.
 */
export function bunInstall() {
  executeCommand('bun install --ignore-scripts', {
    cwd: ROOT_DIR,
    stdio:
      LOG_LEVELS.indexOf(logger.instance.level as LogLevel) >
      LOG_LEVELS.indexOf('debug')
        ? 'pipe'
        : 'inherit'
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

  logger.debug(`Installing ${fullName} from registry...`)

  executeCommand(`bun add ${fullName}@latest --ignore-scripts`, {
    cwd: ROOT_DIR,
    stdio:
      LOG_LEVELS.indexOf(logger.instance.level as LogLevel) >
      LOG_LEVELS.indexOf('info')
        ? 'pipe'
        : 'inherit'
  })

  const installedPath = path.join(ROOT_DIR, 'node_modules', fullName)

  if (!fs.existsSync(installedPath)) {
    logger.actionableError(
      `Failed to install ${fullName}`,
      'Check if the package exists in the registry'
    )

    process.exit(1)
  }

  logger.debug(`Copying ${fullName} to ${targetDir}...`)

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
