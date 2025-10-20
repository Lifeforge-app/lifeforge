import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import type { CommandExecutionOptions } from '../types'
import { CLILoggingService } from './logging'

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
 * Resolves project list, handling 'all' keyword
 */
export function resolveProjects<T extends string>(
  projects: string[],
  allProjects: T[]
): T[] {
  const isAll = projects.includes('all')

  return isAll ? allProjects : (projects as T[])
}

/**
 * Executes a shell command with proper error handling
 */
export function executeCommand(
  command: string | (() => string),
  options: CommandExecutionOptions = {},
  _arguments: string[] = []
): string {
  const cmd = typeof command === 'function' ? command() : command

  if (!options.stdio || options.stdio === 'inherit') {
    CLILoggingService.debug(`Executing: ${cmd}`)
  }

  const [toBeExecuted, ...args] = cmd.split(' ')

  const result = spawnSync(toBeExecuted, [...args, ..._arguments], {
    stdio: 'inherit',
    encoding: 'utf8',
    shell: true,
    ...options
  })

  if (result.error) {
    if (!options.exitOnError) {
      throw result.error
    }

    CLILoggingService.actionableError(
      `Command execution failed: ${cmd}`,
      'Check if the command exists and you have the necessary permissions'
    )
    CLILoggingService.debug(`Error details: ${result.error}`)
    process.exit(1)
  }

  if (result.status !== 0) {
    const error = new Error(`Command failed with exit code ${result.status}`)

    if (!options.exitOnError) {
      throw error
    }

    CLILoggingService.actionableError(
      `Command execution failed: ${cmd}`,
      'Check if the command exists and you have the necessary permissions'
    )
    CLILoggingService.debug(`Exit code: ${result.status}`)
    process.exit(1)
  }

  if (!options.stdio || options.stdio === 'inherit') {
    CLILoggingService.debug(`Completed: ${cmd}`)
  }

  return result.stdout?.toString().trim() || ''
}

/**
 * Validates environment variables
 */
export function validateEnvironment(requiredVars: string[]): void {
  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    CLILoggingService.actionableError(
      `Missing required environment variables: ${missingVars.join(', ')}`,
      'Use the "forge db init" command to set up the environment variables, or set them manually in your env/.env.local file'
    )
    process.exit(1)
  }
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

      return
    }

    const serverInstance = executeCommand(`pgrep -f "${processKeywordOrPID}"`, {
      exitOnError: false,
      stdio: 'pipe'
    })

    if (serverInstance) {
      executeCommand(`pkill -f "${processKeywordOrPID}"`)

      return parseInt(serverInstance, 10)
    }
  } catch {
    // No existing server instance found
  }
}

type PathConfig = {
  path: string
  type: 'file' | 'directory'
}

export function validateFilePaths(
  paths: PathConfig[],
  basedir: string
): boolean {
  for (const p of paths) {
    const { path: pth, type } = p

    const fullPath = path.resolve(basedir, pth)

    if (!fs.existsSync(fullPath)) {
      return false
    }

    const stats = fs.lstatSync(fullPath)

    if (type === 'file' && !stats.isFile()) {
      return false
    }

    if (type === 'directory' && !stats.isDirectory()) {
      return false
    }
  }

  return true
}

/**
 * Checks for running PocketBase instances
 */
export function checkRunningPBInstances(): void {
  try {
    const result = spawnSync('sh', ['-c', "pgrep -f 'pocketbase serve'"], {
      stdio: 'pipe',
      encoding: 'utf8'
    })

    const pbInstanceNumber = result.stdout?.toString().trim()

    if (pbInstanceNumber) {
      CLILoggingService.actionableError(
        `PocketBase is already running (PID: ${pbInstanceNumber})`,
        'Stop the existing instance with "pkill -f pocketbase" before proceeding'
      )
      process.exit(1)
    }
  } catch {
    // No existing instance found, continue with the script
  }
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
