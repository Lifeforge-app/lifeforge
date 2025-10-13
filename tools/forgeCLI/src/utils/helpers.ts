import { execSync } from 'child_process'
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
  options: CommandExecutionOptions = {}
): string {
  const cmd = typeof command === 'function' ? command() : command

  try {
    CLILoggingService.info(`Executing: ${cmd}`)

    const result = execSync(cmd, {
      stdio: 'inherit',
      ...options
    })

    CLILoggingService.info(`Completed: ${cmd}`)

    return result?.toString().trim()
  } catch (error) {
    if (!options.exitOnError) {
      throw error
    }

    CLILoggingService.error(`Failed: ${cmd}`)
    CLILoggingService.error(`${error}`)
    process.exit(1)
  }
}

/**
 * Validates environment variables
 */
export function validateEnvironment(requiredVars: string[]): void {
  const missingVars = requiredVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    CLILoggingService.error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    )
    CLILoggingService.error('Please set them in your .env file.')
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
  CLILoggingService.info(
    `Running ${processType} for ${projects.length} project(s): ${formatProjectList(projects)}`
  )
}

/**
 * Logs a process completion message
 */
export function logProcessComplete(processType: string): void {
  CLILoggingService.info(`All projects ${processType} completed successfully.`)
}

/**
 * Kills existing processes matching the given keyword
 */
export function killExistingProcess(processKeyword: string): void {
  try {
    const serverInstance = executeCommand(`pgrep -f "${processKeyword}"`, {
      exitOnError: false,
      stdio: 'pipe'
    })

    if (serverInstance) {
      executeCommand(`pkill -f "${processKeyword}"`)
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
    const pbInstanceNumber = execSync("pgrep -f 'pocketbase serve'")
      .toString()
      .trim()

    if (pbInstanceNumber) {
      CLILoggingService.error(
        `PocketBase is already running (PID: ${pbInstanceNumber}). Please stop the existing instance before proceeding.`
      )
      process.exit(1)
    }
  } catch {
    // No existing instance found, continue with the script
  }
}
