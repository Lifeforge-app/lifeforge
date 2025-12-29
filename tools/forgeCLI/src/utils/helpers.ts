import chalk from 'chalk'
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import prompts from 'prompts'

import type { CommandExecutionOptions } from '../types'
import CLILoggingService from './logging'

/**
 * Validates if the provided projects are valid
 */
export function validateProjects(
  projects: string[],
  validProjects: string[]
): { isValid: boolean; invalidProjects: string[] } {
  const invalidProjects = projects.filter(
    project => !validProjects.includes(project)
  )

  return {
    isValid: invalidProjects.length === 0,
    invalidProjects
  }
}

/**
 * Executes a shell command with proper error handling
 */
export function executeCommand(
  command: string | (() => string),
  options: CommandExecutionOptions = {},
  _arguments: string[] = []
): string {
  let cmd: string

  try {
    cmd = typeof command === 'function' ? command() : command
  } catch (error) {
    CLILoggingService.actionableError(
      `Failed to generate command: ${error}`,
      'Check the command generation logic for errors'
    )
    process.exit(1)
  }

  try {
    CLILoggingService.debug(`Executing: ${cmd}`)

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
      CLILoggingService.debug(`Completed: ${cmd}`)
    }

    return result.stdout?.toString().trim() || ''
  } catch (error) {
    if (!options.exitOnError) {
      throw error
    }

    CLILoggingService.actionableError(
      `Command execution failed: ${cmd}`,
      'Check if the command exists and you have the necessary permissions'
    )
    CLILoggingService.debug(`Error details: ${error}`)
    process.exit(1)
  }
}

/**
 * Validates environment variables
 */
export function getEnvVars<const T extends readonly string[]>(
  requiredVars: T
): Record<T[number], string> {
  const vars: Record<string, string> = {}

  const missing: string[] = []

  for (const varName of requiredVars) {
    const value = process.env[varName]

    if (value) {
      vars[varName] = value
    } else {
      missing.push(varName)
    }
  }

  if (missing.length > 0) {
    CLILoggingService.actionableError(
      `Missing required environment variables: ${missing.join(', ')}`,
      'Use the "forge db init" command to set up the environment variables, or set them manually in your env/.env.local file'
    )
    process.exit(1)
  }

  return vars as Record<T[number], string>
}

/**
 * Formats project list for display
 */
export function formatProjectList(projects: string[]): string {
  return projects.join(', ')
}

/**
 * Logs a process start message
 */
export function logProcessStart(processType: string, projects: string[]): void {
  CLILoggingService.step(
    `Running ${processType} for ${projects.length} project(s): ${formatProjectList(projects)}`
  )
}

/**
 * Logs a process completion message
 */
export function logProcessComplete(processType: string): void {
  CLILoggingService.success(
    `All projects ${processType} completed successfully`
  )
}

/**
 * Kills existing processes matching the given keyword
 */
export function killExistingProcess(
  processKeywordOrPID: string | number
): number | undefined {
  try {
    if (typeof processKeywordOrPID === 'number') {
      process.kill(processKeywordOrPID)

      CLILoggingService.debug(
        `Killed process with PID: ${chalk.bold.blue(processKeywordOrPID)}`
      )

      return
    }

    const serverInstance = executeCommand(`pgrep -f "${processKeywordOrPID}"`, {
      exitOnError: false,
      stdio: 'pipe'
    })

    if (serverInstance) {
      executeCommand(`pkill -f "${processKeywordOrPID}"`)

      CLILoggingService.debug(
        `Killed process matching keyword: ${chalk.bold.blue(
          processKeywordOrPID
        )} (PID: ${chalk.bold.blue(serverInstance)})`
      )

      return parseInt(serverInstance, 10)
    }
  } catch {
    // No existing server instance found
  }
}

export type PathConfig = {
  path: string
  type: 'file' | 'directory'
  children?: PathConfig[]
}

export function validateFilePaths(
  paths: PathConfig[],
  basedir: string
): boolean {
  for (const p of paths) {
    const { path: pth, type, children } = p

    const fullPath = path.resolve(basedir, pth)

    if (!fs.existsSync(fullPath)) {
      CLILoggingService.error(
        `Invalid module structure detected: ${pth} does not exist`
      )
      process.exit(1)
    }

    const stats = fs.lstatSync(fullPath)

    if (type === 'file' && !stats.isFile()) {
      CLILoggingService.error(
        `Invalid module structure detected: ${pth} is not a file`
      )
      process.exit(1)
    }

    if (type === 'directory' && !stats.isDirectory()) {
      CLILoggingService.error(
        `Invalid module structure detected: ${pth} is not a directory`
      )
      process.exit(1)
    }

    if (children) {
      validateFilePaths(children, fullPath)
    }
  }

  return true
}

export function checkPortInUse(port: number): boolean {
  try {
    const result = spawnSync('nc', ['-zv', 'localhost', port.toString()], {
      stdio: 'pipe',
      encoding: 'utf8'
    })

    return result.status === 0
  } catch {
    return false
  }
}

export async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Checks if running in Docker mode
 */
export function isDockerMode(): boolean {
  return process.env.DOCKER_MODE === 'true'
}

/**
 * Executes a command and returns the output as a string
 */
export function executeCommandWithOutput(
  command: string,
  options: CommandExecutionOptions = {}
): string {
  const [toBeExecuted, ...args] = command.split(' ')

  const result = spawnSync(toBeExecuted, args, {
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true,
    ...options
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(
      `Command failed with exit code ${result.status}: ${result.stderr}`
    )
  }

  return result.stdout?.toString().trim() || ''
}

/**
 * Prompts the user for confirmation
 */
export async function confirmAction(message: string): Promise<boolean> {
  const response = await prompts({
    type: 'confirm',
    name: 'confirmed',
    message,
    initial: false
  })

  return response.confirmed
}
