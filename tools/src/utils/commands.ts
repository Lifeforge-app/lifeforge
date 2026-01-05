import { type IOType, spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import { ROOT_DIR } from '@/constants/constants'

import Logging, { LEVEL_ORDER } from './logging'
import { addDependency } from './packageJson'

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

/**
 * Runs `bun install` in the root directory to install dependencies.
 */
export function bunInstall() {
  executeCommand('bun install', {
    cwd: ROOT_DIR,
    stdio: Logging.level > LEVEL_ORDER['debug'] ? 'pipe' : 'inherit'
  })
}

/**
 * Installs a package from the registry and copies it to the target directory.
 *
 * Downloads the package using `bun add`, copies it from node_modules to the target
 * directory, adds it as a workspace dependency, and runs `bun install`.
 *
 * @param fullName - The full package name (e.g., `@lifeforge/lifeforge--calendar`)
 * @param targetDir - The absolute path to copy the package to
 */
export function installPackage(fullName: string, targetDir: string) {
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  Logging.debug(`Installing ${Logging.highlight(fullName)} from registry...`)

  executeCommand(`bun add ${fullName}@latest`, {
    cwd: ROOT_DIR,
    stdio: Logging.level > LEVEL_ORDER['info'] ? 'pipe' : 'inherit'
  })

  const installedPath = path.join(ROOT_DIR, 'node_modules', fullName)

  if (!fs.existsSync(installedPath)) {
    Logging.actionableError(
      `Failed to install ${Logging.highlight(fullName)}`,
      'Check if the package exists in the registry'
    )

    process.exit(1)
  }

  Logging.debug(`Copying ${Logging.highlight(fullName)} to ${targetDir}...`)

  fs.cpSync(installedPath, targetDir, { recursive: true, dereference: true })

  addDependency(fullName)

  if (fs.existsSync(installedPath)) {
    fs.rmSync(installedPath, { recursive: true, force: true })
  }

  bunInstall()
}
